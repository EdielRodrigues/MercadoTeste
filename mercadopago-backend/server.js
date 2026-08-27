
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const app = express();
app.use(cors({origin:true}));
app.use(express.json({limit:'1mb'}));

const token = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
if(!token){
  console.warn('MERCADO_PAGO_ACCESS_TOKEN não configurado');
}
const client = new MercadoPagoConfig({accessToken: token});
const preference = new Preference(client);
const paymentApi = new Payment(client);

app.get('/',(req,res)=>{
  res.json({
    online:true,
    service:'Mercado Fácil Mercado Pago',
    configured:Boolean(token)
  });
});

app.post('/api/mercadopago/preference', async (req,res)=>{
  try{
    if(!token) return res.status(500).json({message:'MERCADO_PAGO_ACCESS_TOKEN não configurado no servidor'});

    const {orderId,total,customer,items,paymentMethod} = req.body || {};
    if(!orderId || !Number(total) || !Array.isArray(items) || !items.length){
      return res.status(400).json({message:'Pedido inválido'});
    }

    const cleanItems = items
      .filter(i=>Number(i.quantity)>0 && Number(i.unit_price)>=0)
      .map(i=>({
        id:String(i.id||'item'),
        title:String(i.title||'Produto').slice(0,200),
        quantity:Number(i.quantity),
        unit_price:Number(i.unit_price),
        currency_id:'BRL'
      }));

    const body = {
      items: cleanItems,
      external_reference: String(orderId),
      payer: {
        name: String(customer?.name||'').slice(0,100),
        email: String(customer?.email||'').slice(0,150)
      },
      statement_descriptor: 'MERCADO FACIL',
      back_urls: {
        success: process.env.MP_SUCCESS_URL || process.env.APP_URL || undefined,
        pending: process.env.MP_PENDING_URL || process.env.APP_URL || undefined,
        failure: process.env.MP_FAILURE_URL || process.env.APP_URL || undefined
      },
      auto_return: process.env.APP_URL ? 'approved' : undefined,
      metadata: {
        order_id: String(orderId),
        requested_method: String(paymentMethod||'')
      }
    };

    const result = await preference.create({body});
    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  }catch(err){
    console.error(err);
    res.status(500).json({
      message: err?.message || 'Erro ao criar preferência Mercado Pago'
    });
  }
});

// Webhook para confirmação real do pagamento.
app.post('/api/mercadopago/webhook', async (req,res)=>{
  res.sendStatus(200);
  try{
    const type = req.query.type || req.body?.type;
    const id = req.query['data.id'] || req.body?.data?.id;
    if(type !== 'payment' || !id || !token) return;

    const payment = await paymentApi.get({id});
    console.log('PAGAMENTO MERCADO PAGO', {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
      transaction_amount: payment.transaction_amount
    });

    // Próximo passo de produção:
    // atualizar o pedido no Firebase usando Admin SDK quando payment.status === 'approved'.
  }catch(err){
    console.error('Webhook Mercado Pago:',err);
  }
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Mercado Pago backend na porta ${port}`));
