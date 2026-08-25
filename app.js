
// V15.7 - dados da conta ficam somente no Firebase Realtime Database
try{
  localStorage.removeItem('mercado_profile');
  localStorage.removeItem('mercado_address');
}catch(e){}


// ===== TEMA CLARO / ESCURO =====
const THEME_KEY='mercado_theme';
function applyTheme(theme){
  const resolved = theme==='dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme',resolved);
  localStorage.setItem(THEME_KEY,resolved);
  const icon=document.getElementById('themeToggleIcon');
  const btn=document.getElementById('themeToggleBtn');
  if(icon) icon.textContent=resolved==='dark'?'☀️':'🌙';
  if(btn){
    btn.setAttribute('aria-label',resolved==='dark'?'Ativar tema claro':'Ativar tema escuro');
    btn.title=resolved==='dark'?'Tema claro':'Tema escuro';
  }
}
function initTheme(){
  const saved=localStorage.getItem(THEME_KEY);
  if(saved){applyTheme(saved);return}
  const prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark?'dark':'light');
}
initTheme();
const themeToggleBtn=document.getElementById('themeToggleBtn');
if(themeToggleBtn){
  themeToggleBtn.addEventListener('click',()=>{
    const current=document.documentElement.getAttribute('data-theme')||'light';
    applyTheme(current==='dark'?'light':'dark');
  });
}

const seedProducts=[
{id:1,name:'Arroz Tipo 1',unit:'5 kg',price:27.90,oldPrice:31.90,cat:'Mercearia',emoji:'🍚',stock:40,active:true},
{id:2,name:'Feijão Carioca',unit:'1 kg',price:8.99,cat:'Mercearia',emoji:'🫘',stock:32,active:true},
{id:3,name:'Macarrão',unit:'500 g',price:5.49,oldPrice:6.79,cat:'Mercearia',emoji:'🍝',stock:55,active:true},
{id:4,name:'Óleo de Soja',unit:'900 ml',price:7.79,cat:'Mercearia',emoji:'🫗',stock:28,active:true},
{id:5,name:'Leite Integral',unit:'1 L',price:5.29,oldPrice:5.99,cat:'Bebidas',emoji:'🥛',stock:44,active:true},
{id:6,name:'Refrigerante Cola',unit:'2 L',price:10.99,cat:'Bebidas',emoji:'🥤',stock:21,active:true},
{id:7,name:'Suco de Laranja',unit:'1 L',price:8.49,cat:'Bebidas',emoji:'🧃',stock:18,active:true},
{id:8,name:'Banana',unit:'1 kg',price:6.99,cat:'Hortifruti',emoji:'🍌',stock:30,active:true},
{id:9,name:'Tomate',unit:'1 kg',price:8.29,cat:'Hortifruti',emoji:'🍅',stock:22,active:true},
{id:10,name:'Batata',unit:'1 kg',price:6.49,cat:'Hortifruti',emoji:'🥔',stock:26,active:true},
{id:11,name:'Carne Bovina',unit:'1 kg',price:39.90,oldPrice:44.90,cat:'Carnes',emoji:'🥩',stock:14,active:true},
{id:12,name:'Frango Inteiro',unit:'1 kg',price:11.90,cat:'Carnes',emoji:'🍗',stock:16,active:true},
{id:13,name:'Papel Higiênico',unit:'12 rolos',price:18.90,oldPrice:22.50,cat:'Limpeza',emoji:'🧻',stock:12,active:true},
{id:14,name:'Detergente',unit:'500 ml',price:2.79,cat:'Limpeza',emoji:'🧴',stock:60,active:true},
{id:15,name:'Sabão em Pó',unit:'1,6 kg',price:18.49,cat:'Limpeza',emoji:'🧺',stock:20,active:true},
{id:16,name:'Chocolate',unit:'90 g',price:6.99,oldPrice:8.49,cat:'Doces',emoji:'🍫',stock:35,active:true}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], fmt=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const ADMIN_EMAIL='diel_zi_nho25@hotmail.com'; // acesso local demonstrativo; em produção use autenticação no servidor
const MARKET_DEPARTMENTS={
  'Mercearia':[
    'Arroz','Feijão','Massas e Macarrão','Óleos e Azeites','Farinhas e Misturas','Açúcar e Adoçantes','Café','Chás e Infusões','Achocolatados','Cereais matinais','Aveias e Granolas','Grãos e Sementes','Molhos','Temperos e Especiarias','Sal','Vinagres','Enlatados','Conservas','Sopas e Caldos','Purês e Preparos','Biscoitos e Torradas','Pães industrializados','Produtos Naturais','Diet e Light','Sem Glúten','Sem Lactose','Importados','Outros de Mercearia'
  ],
  'Bebidas':[
    'Água mineral','Água com gás','Água saborizada','Refrigerantes','Sucos e Néctares','Água de coco','Energéticos','Isotônicos','Chás prontos','Cafés prontos','Bebidas lácteas','Achocolatados prontos','Xaropes e Concentrados','Bebidas sem álcool','Outras Bebidas'
  ],
  'Carnes e Açougue':[
    'Carne bovina','Carne suína','Frango e Aves','Peixes','Frutos do mar','Linguiças','Embutidos','Hambúrgueres','Almôndegas','Carnes temperadas','Carnes porcionadas','Miúdos','Churrasco','Outros do Açougue'
  ],
  'Frios e Laticínios':[
    'Leites','Leites especiais','Queijos','Iogurtes','Manteigas','Margarinas','Requeijão','Cremes de queijo','Creme de leite','Leite condensado','Presuntos','Mortadelas','Salames','Peito de peru','Frios fatiados','Ovos','Sobremesas refrigeradas','Outros Laticínios'
  ],
  'Hortifruti':[
    'Frutas','Frutas importadas','Verduras','Legumes','Raízes e Tubérculos','Temperos frescos','Ervas frescas','Cogumelos','Orgânicos','Saladas prontas','Frutas cortadas','Polpas frescas','Outros Hortifruti'
  ],
  'Padaria e Confeitaria':[
    'Pães franceses','Pães de forma','Pães integrais','Pães especiais','Pão de queijo','Bolos','Tortas','Doces de padaria','Salgados','Sanduíches','Massas frescas','Confeitaria','Biscoitos de padaria','Outros da Padaria'
  ],
  'Congelados':[
    'Pizzas','Lasanhas','Pratos prontos','Vegetais congelados','Frutas congeladas','Carnes congeladas','Peixes congelados','Salgados congelados','Pães de queijo congelados','Batatas congeladas','Sorvetes','Picolés','Açaí','Polpas de frutas','Outros Congelados'
  ],
  'Limpeza':[
    'Detergentes','Lava-roupas em pó','Lava-roupas líquido','Sabão em barra','Amaciantes','Tira-manchas','Desinfetantes','Água sanitária','Limpadores multiuso','Limpa-vidros','Limpeza de banheiro','Limpeza de cozinha','Limpeza de piso','Esponjas','Panos','Luvas','Vassouras e Rodos','Sacos de lixo','Inseticidas','Repelentes de ambiente','Odorizadores','Outros de Limpeza'
  ],
  'Higiene e Beleza':[
    'Papel higiênico','Sabonetes','Sabonete líquido','Shampoo','Condicionador','Máscaras capilares','Desodorantes','Creme dental','Escovas dentais','Fio dental','Enxaguante bucal','Cuidados com a pele','Hidratantes','Protetor solar','Cuidados com o cabelo','Tintura','Barbear','Absorventes','Protetores diários','Fraldas geriátricas','Algodão e Cotonetes','Perfumes e Colônias','Maquiagem','Outros de Higiene e Beleza'
  ],
  'Doces e Snacks':[
    'Chocolates','Bombons','Balas','Chicletes','Pirulitos','Biscoitos doces','Cookies','Wafers','Salgadinhos','Pipocas','Amendoins','Castanhas','Mix de nuts','Barras de cereal','Barrinhas proteicas','Paçocas','Doces tradicionais','Gelatinas','Sobremesas','Outros Doces e Snacks'
  ],
  'Bebê e Infantil':[
    'Fraldas','Lenços umedecidos','Papinhas','Leites e Fórmulas','Cereais infantis','Sucos infantis','Higiene do bebê','Shampoo infantil','Sabonete infantil','Pomadas','Mamadeiras','Chupetas','Acessórios para bebê','Outros para Bebê'
  ],
  'Pet Shop':[
    'Ração para cães','Ração para gatos','Ração para outros pets','Sachês e alimentos úmidos','Petiscos','Areia sanitária','Tapetes higiênicos','Shampoo Pet','Higiene Pet','Brinquedos Pet','Acessórios Pet','Outros Pet'
  ],
  'Utilidades Domésticas':[
    'Papel alumínio','Filme PVC','Papel manteiga','Guardanapos','Papel toalha','Descartáveis','Copos','Pratos e Talheres','Potes e Recipientes','Utensílios de cozinha','Organização','Limpeza doméstica','Pilhas e baterias','Lâmpadas','Extensões e tomadas','Fósforos e acendedores','Velas','Outras Utilidades'
  ],
  'Cuidados com a Casa':[
    'Aromatizadores','Velas aromáticas','Antimofo','Produtos para móveis','Produtos para inox','Produtos para eletrodomésticos','Produtos para roupas','Outros Cuidados com a Casa'
  ],
  'Farmácia e Bem-estar':[
    'Primeiros socorros','Curativos','Álcool e Antissépticos','Termômetros','Máscaras','Higiene nasal','Vitaminas permitidas','Cuidados dos pés','Repelentes corporais','Preservativos','Lubrificantes pessoais','Outros de Bem-estar'
  ],
  'Orgânicos e Saudáveis':[
    'Orgânicos','Integrais','Sem açúcar','Sem glúten','Sem lactose','Veganos','Vegetarianos','Proteicos','Funcionais','Naturais','Chás funcionais','Snacks saudáveis','Outros Saudáveis'
  ],
  'Adega sem Álcool':[
    'Cerveja sem álcool','Espumante sem álcool','Vinho sem álcool','Drinks sem álcool','Misturas para drinks','Água tônica','Outros sem álcool'
  ],
  'Festas e Descartáveis':[
    'Copos descartáveis','Pratos descartáveis','Talheres descartáveis','Canudos','Guardanapos de festa','Toalhas de mesa','Velas de aniversário','Balões','Artigos para festa','Outros de Festa'
  ],
  'Churrasco':[
    'Carvão','Acendedores','Espetos','Grelhas','Sal grosso','Temperos para churrasco','Farofas','Molhos para churrasco','Descartáveis para churrasco','Outros de Churrasco'
  ],
  'Automotivo Básico':[
    'Aromatizantes automotivos','Panos automotivos','Limpeza automotiva','Água desmineralizada','Outros Automotivos'
  ],
  'Papelaria e Conveniência':[
    'Canetas','Lápis','Borrachas','Cadernos','Papéis','Fitas adesivas','Colas','Envelopes','Isqueiros','Carregadores básicos','Outros de Conveniência'
  ],
  'Flores e Jardinagem':[
    'Flores','Vasos','Terra e substratos','Sementes','Adubos domésticos','Acessórios de jardinagem','Outros de Jardinagem'
  ],
  'Outros':[
    'Produto sem categoria definida','Sazonais','Importados especiais','Bazar','Outros produtos'
  ]
};
const DEPARTMENT_EMOJIS={
  'Mercearia':'🛒','Bebidas':'🥤','Carnes e Açougue':'🥩','Frios e Laticínios':'🥛','Hortifruti':'🥬','Padaria e Confeitaria':'🥖','Congelados':'❄️','Limpeza':'🧽','Higiene e Beleza':'🧴','Doces e Snacks':'🍫','Bebê e Infantil':'🍼','Pet Shop':'🐾','Utilidades Domésticas':'🏠','Cuidados com a Casa':'✨','Farmácia e Bem-estar':'🩹','Orgânicos e Saudáveis':'🌿','Adega sem Álcool':'🍹','Festas e Descartáveis':'🎉','Churrasco':'🔥','Automotivo Básico':'🚗','Papelaria e Conveniência':'✏️','Flores e Jardinagem':'🌷','Outros':'📦'
};
function normalizeDepartment(value){const raw=String(value||'').trim();if(MARKET_DEPARTMENTS[raw])return raw;const v=raw.toLowerCase();if(/carne|açougue|acougue|frango|peixe|suín|suin/.test(v))return 'Carnes e Açougue';if(/latic|leite|queijo|frios|iogurte/.test(v))return 'Frios e Laticínios';if(/hort|fruta|verdura|legume|tomate|banana/.test(v))return 'Hortifruti';if(/padaria|pão|pao|bolo|confeitaria/.test(v))return 'Padaria e Confeitaria';if(/bebida|refriger|suco|água|agua|energ/.test(v))return 'Bebidas';if(/limpeza|deterg|sabão|sabao|amaciante/.test(v))return 'Limpeza';if(/higiene|beleza|shampoo|sabonete|desodor/.test(v))return 'Higiene e Beleza';if(/doce|chocolate|snack|biscoito|salgadinho/.test(v))return 'Doces e Snacks';if(/pet|ração|racao|cachorro|gato/.test(v))return 'Pet Shop';if(/bebê|bebe|fralda infantil/.test(v))return 'Bebê e Infantil';if(/congel|sorvete|picolé|picole/.test(v))return 'Congelados';if(/orgân|organ|sem glúten|sem gluten|saud/.test(v))return 'Orgânicos e Saudáveis';if(/churrasco|carvão|carvao/.test(v))return 'Churrasco';if(/papelaria|caneta|caderno/.test(v))return 'Papelaria e Conveniência';if(/flor|jard/.test(v))return 'Flores e Jardinagem';if(/util|papel alum|descart/.test(v))return 'Utilidades Domésticas';return 'Mercearia'}
function guessSubcategory(cat,name=''){const text=String(name||'').toLowerCase();const map={
'Mercearia':[['arroz','Arroz'],['feijão','Feijão'],['feijao','Feijão'],['macarr','Massas e Macarrão'],['óleo','Óleos e Azeites'],['oleo','Óleos e Azeites'],['azeite','Óleos e Azeites'],['café','Café'],['cafe','Café'],['farinha','Farinhas e Misturas'],['açúcar','Açúcar e Adoçantes'],['acucar','Açúcar e Adoçantes']],
'Bebidas':[['água','Água mineral'],['agua','Água mineral'],['refriger','Refrigerantes'],['suco','Sucos e Néctares'],['energ','Energéticos']],
'Carnes e Açougue':[['frango','Frango e Aves'],['bovina','Carne bovina'],['carne','Carne bovina'],['suín','Carne suína'],['suin','Carne suína'],['peixe','Peixes'],['lingui','Linguiças']],
'Frios e Laticínios':[['leite','Leites'],['queijo','Queijos'],['iogurte','Iogurtes'],['manteiga','Manteigas'],['presunto','Presuntos'],['ovo','Ovos']],
'Hortifruti':[['banana','Frutas'],['maçã','Frutas'],['maca','Frutas'],['tomate','Legumes'],['batata','Raízes e Tubérculos'],['alface','Verduras']],
'Padaria e Confeitaria':[['pão de queijo','Pão de queijo'],['pao de queijo','Pão de queijo'],['bolo','Bolos'],['torta','Tortas'],['salgad','Salgados'],['pão','Pães franceses'],['pao','Pães franceses']],
'Limpeza':[['deterg','Detergentes'],['sabão em pó','Lava-roupas em pó'],['sabao em po','Lava-roupas em pó'],['amaciante','Amaciantes'],['desinf','Desinfetantes'],['água sanit','Água sanitária'],['agua sanit','Água sanitária']],
'Higiene e Beleza':[['papel higi','Papel higiênico'],['sabonete','Sabonetes'],['shampoo','Shampoo'],['condicionador','Condicionador'],['desodor','Desodorantes'],['creme dental','Creme dental']],
'Doces e Snacks':[['chocolate','Chocolates'],['bala','Balas'],['chiclete','Chicletes'],['salgad','Salgadinhos']],
'Pet Shop':[['cão','Ração para cães'],['cao','Ração para cães'],['gato','Ração para gatos'],['ração','Ração para cães'],['racao','Ração para cães']],
'Bebê e Infantil':[['fralda','Fraldas'],['lenço','Lenços umedecidos'],['lenco','Lenços umedecidos'],['fórmula','Leites e Fórmulas'],['formula','Leites e Fórmulas']],
'Congelados':[['pizza','Pizzas'],['sorvete','Sorvetes'],['picolé','Picolés'],['picole','Picolés'],['lasanha','Lasanhas']],
'Churrasco':[['carvão','Carvão'],['carvao','Carvão'],['sal grosso','Sal grosso']]
};for(const [needle,sub] of (map[cat]||[]))if(text.includes(needle))return sub;return (MARKET_DEPARTMENTS[cat]||[])[0]||'Produto sem categoria definida'}
function slugCategory(v=''){return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'geral'}
function productStoragePath(cat,sub,id='novo'){return `catalogo/${slugCategory(cat)}/${slugCategory(sub)}/${id}`}
function setupCategoryControls(selectedCat='',selectedSub=''){const catSel=$('#productCategorySelect'),subSel=$('#productSubcategorySelect'),quick=$('#categoryQuickButtons');if(!catSel||!subSel)return;const cat=normalizeDepartment(selectedCat||catSel.value||'Mercearia');catSel.innerHTML=Object.keys(MARKET_DEPARTMENTS).map(c=>`<option value="${c}">${DEPARTMENT_EMOJIS[c]||'•'} ${c}</option>`).join('');catSel.value=cat;const subs=MARKET_DEPARTMENTS[cat]||[];subSel.innerHTML=subs.map(s=>`<option value="${s}">${s}</option>`).join('');subSel.value=subs.includes(selectedSub)?selectedSub:guessSubcategory(cat,($('#productForm')?.elements.name?.value||''));if(!subSel.value&&subs.length)subSel.value=subs[0];if(quick){quick.innerHTML=Object.keys(MARKET_DEPARTMENTS).map(c=>`<button type="button" class="category-quick-btn ${c===cat?'active':''}" data-dept="${c}" title="${c}"><span>${DEPARTMENT_EMOJIS[c]||'•'}</span><b>${c}</b></button>`).join('');quick.querySelectorAll('[data-dept]').forEach(b=>b.onclick=()=>{catSel.value=b.dataset.dept;setupCategoryControls(b.dataset.dept,'')})}updateCategoryPath()}
function updateCategoryPath(){const cat=$('#productCategorySelect')?.value,sub=$('#productSubcategorySelect')?.value,box=$('#categoryPathPreview'),db=$('#databasePathPreview');if(box)box.innerHTML=`<span>Destino no catálogo</span><strong>${DEPARTMENT_EMOJIS[cat]||'🛒'} ${cat||'—'} <b>›</b> ${sub||'—'}</strong>`;if(db)db.textContent=productStoragePath(cat,sub,$('#productForm')?.elements.id?.value||'novo-produto')}
let products=(JSON.parse(localStorage.getItem('mercado_products')||'null')||seedProducts).map(p=>{const cat=normalizeDepartment(p.cat);return {...p,cat,subcat:p.subcat||guessSubcategory(cat,p.name),stock:Number.isFinite(+p.stock)?+p.stock:20,active:p.active!==false}});
let cart=JSON.parse(localStorage.getItem('mercado_cart')||'{}');
let favorites=JSON.parse(localStorage.getItem('mercado_favorites')||'[]');
let profile={};
let selectedCat='Todos',onlyOffers=false,onlyFavorites=false,orderMode='delivery',coupon='';
let isAdmin=sessionStorage.getItem('mercado_admin_session')==='1' && (profile.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase();
function persist(){localStorage.setItem('mercado_cart',JSON.stringify(cart));localStorage.setItem('mercado_favorites',JSON.stringify(favorites));}
function customerProducts(){return products.filter(p=>p.active!==false&&p.stock>0)}
function categories(){return ['Todos',...new Set(customerProducts().map(p=>p.cat))]}
function renderCategories(){const cats=categories();if(!cats.includes(selectedCat))selectedCat='Todos';$('#categories').innerHTML=cats.map(c=>`<button class="cat-btn ${c===selectedCat?'active':''}" data-cat="${c}">${c}</button>`).join('');$$('[data-cat]').forEach(b=>b.onclick=()=>{selectedCat=b.dataset.cat;onlyOffers=false;onlyFavorites=false;renderCategories();renderProducts()})}
function getFiltered(){let list=customerProducts();const q=$('#searchInput').value.toLowerCase().trim();if(selectedCat!=='Todos')list=list.filter(p=>p.cat===selectedCat);if(onlyOffers)list=list.filter(p=>p.oldPrice>p.price);if(onlyFavorites)list=list.filter(p=>favorites.some(x=>String(x)===String(p.id)));if(q)list=list.filter(p=>`${p.name} ${p.cat} ${p.subcat||''} ${p.unit}`.toLowerCase().includes(q));const sort=$('#sortSelect').value;if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));return list}
function renderProducts(){const list=getFiltered();$('#productCount').textContent=`${list.length} itens`;$('#catalogTitle').textContent=onlyOffers?'Ofertas do dia':onlyFavorites?'Meus favoritos':selectedCat==='Todos'?'Todos os produtos':selectedCat;$('#productGrid').innerHTML=list.length?list.map(p=>{const q=Math.min(cart[String(p.id)]||cart[String(p.id)]||0,p.stock),fav=favorites.some(x=>String(x)===String(p.id));return `<article class="product-card">${p.oldPrice>p.price?'<span class="offer-tag">OFERTA</span>':''}<button class="fav-btn" data-fav="${p.id}">${fav?'❤️':'🤍'}</button><div class="product-image">${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove();this.parentElement.textContent='${p.emoji||'🛒'}'">`:p.emoji||'🛒'}</div><h4>${p.name}</h4><small>${p.brand?`${p.brand} • `:''}${p.unit} • ${p.cat}${p.subcat?` › ${p.subcat}`:''}</small><div class="stock-label">${p.stock<=5?`Últimas ${p.stock} unidades`:'Disponível'}</div><div class="prices">${p.oldPrice?`<span class="old-price">${fmt(p.oldPrice)}</span>`:''}<span class="price">${fmt(p.price)}</span></div><div class="product-action">${q?`<div class="inline-qty"><button data-ch="${p.id}" data-d="-1">−</button><strong>${q}</strong><button data-ch="${p.id}" data-d="1">+</button></div>`:`<button class="add-btn" data-add="${p.id}">Adicionar</button>`}</div></article>`}).join(''):`<div class="empty">Nenhum produto encontrado.</div>`;$$('[data-add]').forEach(b=>b.onclick=()=>change(b.dataset.add,1));$$('[data-ch]').forEach(b=>b.onclick=()=>change(b.dataset.ch,+b.dataset.d));$$('[data-fav]').forEach(b=>b.onclick=()=>toggleFav(b.dataset.fav))}
function toggleFav(id){
  const key=String(id);
  const exists=favorites.some(x=>String(x)===key);
  favorites=exists?favorites.filter(x=>String(x)!==key):[...favorites,key];
  persist();renderProducts()
}
function change(id,d){
  const key=String(id);
  const p=products.find(x=>String(x.id)===key);
  if(!p||p.active===false){toast('Produto indisponível');return}
  const stock=Number(p.stock||0);
  const current=Number(cart[key]||0);
  const next=current+Number(d||0);
  if(next>stock){toast('Quantidade maior que o estoque disponível');return}
  if(next<=0) delete cart[key]; else cart[key]=next;
  persist();
  renderProducts();
  renderCartBar();
  const drawer=$('#cartDrawer');
  if(drawer&&drawer.classList.contains('open')) renderCart();
}
function totals(){let count=0,subtotal=0;Object.entries(cart).forEach(([id,q])=>{const p=products.find(x=>String(x.id)===String(id)&&x.active!==false);if(p){const valid=Math.min(q,p.stock);count+=valid;subtotal+=p.price*valid}});let discount=coupon==='MERCADO10'?subtotal*.10:0;const delivery=orderMode==='pickup'||subtotal>=100||!count?0:8;return{count,subtotal,discount,delivery,total:Math.max(0,subtotal-discount+delivery)}}
function renderCartBar(){const t=totals();$('#cartCount').textContent=t.count;$('#cartTotal').textContent=fmt(t.total)}
function renderCart(){const entries=Object.entries(cart).filter(([id])=>products.some(p=>String(p.id)===String(id)&&p.active!==false));$('#cartItems').innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>String(x.id)===String(id));const valid=Math.min(q,p.stock);return `<div class="cart-item"><div class="emoji">${p.emoji||'🛒'}</div><div><h4>${p.name}</h4><small>${fmt(p.price)} • ${p.unit}</small></div><div class="qty"><button onclick="change(${p.id},-1)">−</button><strong>${valid}</strong><button onclick="change(${p.id},1)">+</button></div></div>`}).join(''):'<div class="empty">🛒<br><br>Seu carrinho está vazio.</div>';const t=totals();$('#subtotal').textContent=fmt(t.subtotal);$('#discount').textContent='- '+fmt(t.discount);$('#delivery').textContent=fmt(t.delivery);$('#grandTotal').textContent=fmt(t.total);$('#shippingTip').textContent=t.subtotal>0&&t.subtotal<100&&orderMode==='delivery'?`Faltam ${fmt(100-t.subtotal)} para frete grátis.`:t.subtotal>=100?'Você ganhou frete grátis!':'';renderCartBar()}
function toast(msg){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function openModal(id){const el=$(id);if(!el)return;el.classList.add('open');el.setAttribute('aria-hidden','false')}function closeModal(id){const el=$(id);if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true')}
function forceCloseProfile(ev){if(ev){ev.preventDefault();ev.stopPropagation();}const el=document.getElementById('profileModal');if(el){el.classList.remove('open');el.setAttribute('aria-hidden','true');el.style.display='none';requestAnimationFrame(()=>{el.style.display='';});}document.body.classList.remove('modal-open');return false;}
window.forceCloseProfile=forceCloseProfile;
function getOrders(){return JSON.parse(localStorage.getItem('mercado_orders')||'[]')}
function saveOrders(orders){localStorage.setItem('mercado_orders',JSON.stringify(orders))}
function customerOrderMatch(o){const pe=(profile.email||'').trim().toLowerCase(),pp=(profile.phone||'').replace(/\D/g,'');const oe=(o.customer?.email||'').trim().toLowerCase(),op=(o.customer?.phone||'').replace(/\D/g,'');if(pe&&oe)return pe===oe;if(pp&&op)return pp===op;return false}
function getCustomerOrders(){
  const seen=new Set();
  return getOrders().filter(customerOrderMatch).filter(o=>{
    const key=String(o?.id||'');
    if(!key||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function renderOrders(){const orders=getCustomerOrders();$('#ordersList').innerHTML=orders.length?orders.map(o=>`<div class="order-card"><div class="order-card-head"><div><h4>${o.id}</h4><small>${new Date(o.date).toLocaleString('pt-BR')}</small></div><strong>${fmt(o.total)}</strong></div><span class="status">${o.status}</span><button type="button" class="add-btn repeat-order-btn" data-repeat-order="${o.id}" style="margin-top:9px" onclick="repeatOrder('${o.id}')">Comprar novamente</button></div>`).join(''):'<div class="empty">Você ainda não fez pedidos com esta conta.</div>'}
function renderProfile(){
  const f=$('#profileForm');
  if(f){
    ['name','phone','email'].forEach(k=>{
      if(f.elements[k]) f.elements[k].value=profile[k]||'';
    });
    if(f.elements.password) f.elements.password.value='';
    if(f.elements.address) f.elements.address.value=profile.address||profile.address||'';
  }

  const adminRecognized=isAdminAccount();
  const role=$('#profileRoleLabel');
  if(role) role.textContent=adminRecognized?'Conta administradora reconhecida':'Conta de cliente';

  const adminBtn=$('#adminAccessBtn');
  if(adminBtn) adminBtn.hidden=!adminRecognized;

  const orders=getCustomerOrders();
  const purchasedQty=orders.reduce((sum,o)=>{
    return sum+(Array.isArray(o.items)?o.items.reduce((s,item)=>s+Number(item?.[1]||0),0):0);
  },0);
  const totalSpent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);

  const setText=(id,value)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=value;
  };

  setText('profileDisplayName',profile.name||'Faça seu cadastro');
  setText('profileDisplayEmail',profile.email||'Seu e-mail aparecerá aqui');
  setText('profilePhoneView',profile.phone||'Não informado');
  setText('profileAddressView',profile.address||profile.address||'Não informado');
  setText('profileEmailView',profile.email||'Não informado');
  setText('profileOrderCount',purchasedQty);
  setText('profileSpentTotal',fmt(totalSpent));
  setText('profileFavoriteCount',favorites.length);

  const avatar=document.getElementById('profileAvatarLg');
  if(avatar){
    avatar.textContent=(profile.name||profile.email||'👤').trim().charAt(0).toUpperCase()||'👤';
  }

  const list=$('#profileOrdersList');
  if(list){
    list.innerHTML=orders.length?orders.map(o=>{
      const orderQty=(o.items||[]).reduce((s,item)=>s+Number(item?.[1]||0),0);
      const items=(o.items||[]).map(([pid,q])=>{
        const pp=products.find(x=>String(x.id)===String(pid));
        return `<div class="history-item-row"><span>${q}x</span><strong>${pp?pp.name:'Produto'}</strong></div>`;
      }).join('');

      return `<article class="profile-history-card">
        <div class="profile-history-head">
          <div>
            <span class="history-code-label">CÓDIGO DA COMPRA</span>
            <h4>${o.id}</h4>
          </div>
          <span class="history-status">${o.status||'Recebido'}</span>
        </div>
        <div class="profile-history-meta">
          <span>📅 ${new Date(o.date).toLocaleString('pt-BR')}</span>
          <span>🛒 ${orderQty} ${orderQty===1?'produto':'produtos'}</span>
        </div>
        <div class="profile-history-items">${items}</div>
        <div class="profile-history-total">
          <span>Total da compra</span>
          <strong>${fmt(o.total)}</strong>
        </div>
      </article>`;
    }).join(''):'<div class="empty">Nenhuma compra vinculada a este perfil.</div>';
  }

  if(typeof updateAdvancedProfile==='function'){
    try{updateAdvancedProfile()}catch(e){console.warn('Perfil avançado:',e)}
  }
}
function isAdminAccount(){return isAdmin && (profile.email||'').trim().toLowerCase()===ADMIN_EMAIL.toLowerCase()}
function repeatOrder(id){const o=getCustomerOrders().find(x=>x.id===id);if(!o)return;cart={};o.items.forEach(([pid,q])=>{const p=products.find(x=>x.id==pid&&x.active!==false);if(p&&p.stock>0)cart[pid]=Math.min(q,p.stock)});persist();closeModal('#ordersModal');renderAll();toast('Produtos disponíveis adicionados ao carrinho')}
function requireAdmin(){if(!isAdminAccount()){toast('Acesso exclusivo da conta administradora');return false}return true}
function renderAdmin(){if(!requireAdmin())return;const orders=getOrders();$('#adminProducts').textContent=products.length;$('#adminOrders').textContent=orders.length;$('#adminSales').textContent=fmt(orders.reduce((sum,o)=>sum+Number(o.total||0),0));const low=products.filter(p=>p.active&&p.stock<=Number(p.minStock??5));$('#adminLowStock').textContent=low.length;
  const q=($('#adminProductSearch')?.value||'').toLowerCase().trim();const list=products.filter(p=>!q||`${p.name} ${p.brand||''} ${p.cat} ${p.subcat||''} ${p.barcode||''} ${p.sku||''}`.toLowerCase().includes(q));
  $('#adminProductList').innerHTML=list.length?`<div class="product-admin-grid">`+list.map(p=>`<article class="admin-product-card">
    <div class="admin-product-card-top"><div class="admin-product-photo">${p.image?`<img src="${p.image}" alt="${p.name}" onerror="this.remove();this.parentElement.textContent='${p.emoji||'🛒'}'">`:p.emoji||'🛒'}</div><div class="admin-product-title"><strong>${p.name}</strong><small>${p.brand||p.unit||'Sem marca'}${p.barcode?` · ${p.barcode}`:''}</small></div></div>
    <div class="admin-product-cells">
      <div class="admin-info-cell"><span>Destino</span><strong>${p.cat}</strong><small>${p.subcat||'Sem seção'}</small></div>
      <div class="admin-info-cell"><span>Preço</span><strong>${fmt(p.price)}</strong><small>${p.oldPrice?`Anterior ${fmt(Number(p.oldPrice))}`:'Preço atual'}</small></div>
      <div class="admin-info-cell"><span>Estoque</span><strong class="stock-number ${p.stock===0?'out-text':p.stock<=Number(p.minStock??5)?'low-text':''}">${p.stock}</strong><small>Mínimo ${p.minStock??5}</small></div>
      <div class="admin-info-cell"><span>Status</span><strong>${p.active?'Publicado':'Oculto'}</strong><small>${p.sku||'Sem SKU'}</small></div>
    </div>
    <div class="admin-card-actions"><button type="button" class="edit-btn edit-text-btn" data-edit-product="${p.id}">✎ Editar produto</button><button type="button" class="delete-btn delete-text-btn" data-delete-product="${p.id}">🗑 Excluir</button></div>
  </article>`).join('')+`</div>`:'<div class="empty">Nenhum produto encontrado.</div>';
  const recent=orders.slice(0,5);$('#adminRecentOrders').innerHTML=recent.length?recent.map(o=>`<div class="mini-row"><div><strong>${o.id} · ${o.customer?.name||'Cliente'}</strong><small>${new Date(o.date).toLocaleString('pt-BR')} · ${o.status}</small></div><div class="mini-value">${fmt(o.total)}</div></div>`).join(''):'<div class="empty">Nenhum pedido ainda.</div>';
  $('#adminStockAlerts').innerHTML=low.length?low.sort((a,b)=>a.stock-b.stock).slice(0,6).map(p=>`<div class="mini-row"><div><strong>${p.name}</strong><small>${p.cat} · mínimo ${p.minStock??5}</small></div><div class="mini-value attention">${p.stock} un.</div></div>`).join(''):'<div class="empty">Estoque saudável.</div>';
  renderAdminOrders();updateProductPreview();updateMarginPreview()}
function renderAdminOrders(){if(!isAdmin)return;const orders=getOrders();$('#adminOrdersList').innerHTML=orders.length?orders.map(o=>`<div class="order-card"><div class="order-card-head"><div><h4>${o.id}</h4><small>${new Date(o.date).toLocaleString('pt-BR')} • ${o.customer?.name||'Cliente'}</small></div><strong>${fmt(o.total)}</strong></div><div class="admin-order-actions"><select id="status-${o.id}">${['Recebido','Separando','Saiu para entrega','Pronto para retirada','Concluído','Cancelado'].map(st=>`<option ${o.status===st?'selected':''}>${st}</option>`).join('')}</select><button onclick="updateOrderStatus('${o.id}')">Atualizar</button><button class="danger-mini" onclick="deleteOrder('${o.id}')">Excluir</button></div></div>`).join(''):'<div class="empty">Nenhum pedido recebido.</div>'}
async function updateOrderStatus(id){if(!requireAdmin())return;const statusValue=$(`#status-${id}`).value;try{if(window.firebaseBackend?.updateOrderStatus)await window.firebaseBackend.updateOrderStatus(id,statusValue);else throw new Error('Firebase indisponível');renderAdmin();toast('Status salvo no banco e no navegador')}catch(e){toast('Falha no banco. Nada foi salvo localmente')}}
async function deleteOrder(id){if(!requireAdmin()||!confirm('Excluir este pedido do painel?'))return;try{if(window.firebaseBackend?.deleteOrder)await window.firebaseBackend.deleteOrder(id);else throw new Error('Firebase indisponível');renderAdmin();toast('Pedido excluído do banco e do navegador')}catch(e){toast('Falha no banco. Pedido não foi excluído')}}
function editProduct(id){
  if(!requireAdmin()) return;

  const key=String(id);
  const p=products.find(x=>String(x.id)===key);
  const f=$('#productForm');

  if(!p){
    toast('Produto não encontrado para edição');
    return;
  }
  if(!f){
    toast('Formulário de produto não encontrado');
    return;
  }

  ['id','barcode','sku','brand','name','unit','price','cost','oldPrice','stock','minStock','location','image','emoji','description'].forEach(k=>{
    if(f.elements[k]) f.elements[k].value=p[k]??'';
  });

  setupCategoryControls(p.cat,p.subcat||'');

  if(f.elements.active) f.elements.active.checked=p.active!==false;

  const state=$('#productEditState');
  if(state) state.textContent='Modo edição · '+(p.name||'Produto');

  updateCategoryPath();
  updateProductPreview();
  updateMarginPreview();

  const pane=document.getElementById('adminCatalogPane');
  if(pane && !pane.classList.contains('active')){
    document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.admin-pane').forEach(el=>el.classList.remove('active'));
    pane.classList.add('active');
    document.querySelectorAll('[data-admin-tab="catalog"]').forEach(b=>b.classList.add('active'));
  }

  f.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>{
    if(f.elements.name) f.elements.name.focus({preventScroll:true});
  },350);

  toast('Produto carregado para edição');
}
async function deleteProduct(id){id=String(id);if(!requireAdmin()||!confirm('Excluir este produto? Esta ação é exclusiva do administrador.'))return;try{if(window.firebaseBackend?.deleteProduct)await window.firebaseBackend.deleteProduct(id);else throw new Error('Firebase indisponível');delete cart[id];persist();renderAll();renderAdmin();toast('Produto excluído do banco e do navegador')}catch(e){toast('Falha no banco. Produto não foi excluído')}}
function clearProductForm(){const f=$('#productForm');f.reset();f.elements.id.value='';f.elements.stock.value=20;if(f.elements.minStock)f.elements.minStock.value=5;f.elements.active.checked=true;setupCategoryControls('Mercearia','');$('#productEditState').textContent='Novo produto';updateProductPreview();updateMarginPreview()}

const PRODUCT_DATABASES=[
  {key:'food',name:'Open Food Facts',url:'https://world.openfoodfacts.org'},
  {key:'beauty',name:'Open Beauty Facts',url:'https://world.openbeautyfacts.org'},
  {key:'pet',name:'Open Pet Food Facts',url:'https://world.openpetfoodfacts.org'},
  {key:'products',name:'Open Products Facts',url:'https://world.openproductsfacts.org'}
];
let scannerStream=null,scannerTimer=null,scannerBusy=false;
function setDbState(key,state){const el=document.querySelector(`[data-db="${key}"]`);if(!el)return;el.classList.remove('checking','found','miss','error');if(state)el.classList.add(state)}
function resetDbStates(){PRODUCT_DATABASES.forEach(x=>setDbState(x.key,''))}
function cleanBarcode(value){return String(value||'').trim().replace(/\s+/g,'')}
function barcodeFromQr(value){const raw=String(value||'').trim();if(/^\d{8,14}$/.test(raw))return raw;try{const u=new URL(raw);for(const k of ['code','barcode','gtin','ean','upc']){const v=u.searchParams.get(k);if(v&&/^\d{8,14}$/.test(v))return v}const m=u.pathname.match(/(?:^|\/)(\d{8,14})(?:\/|$)/);if(m)return m[1]}catch(e){}const m=raw.match(/\b\d{8,14}\b/);return m?m[0]:''}
function mapCategory(p,sourceKey){const text=(p.categories||p.categories_tags?.[0]||'').toLowerCase();if(sourceKey==='beauty')return 'Higiene e Beleza';if(sourceKey==='pet')return 'Pet';if(sourceKey==='products')return 'Utilidades';if(/bebida|drink|juice|water|soda|milk/.test(text))return 'Bebidas';if(/meat|carne|chicken|frango|fish|peixe/.test(text))return 'Carnes';if(/fruit|vegetable|fruta|verdura|legume/.test(text))return 'Hortifruti';if(/sweet|chocolate|candy|doce|biscuit|cookie/.test(text))return 'Doces';if(/clean|deterg|hygiene|limpeza/.test(text))return 'Limpeza';return (p.categories||'Mercearia').split(',')[0].trim()||'Mercearia'}
function mergeLookupResults(found,code){const merged={barcode:code,brand:'',name:'',cat:'',subcat:'',unit:'',image:''};for(const item of found){const p=item.product||{};merged.name ||= p.product_name_pt||p.product_name||p.generic_name_pt||p.generic_name||'';merged.brand ||= p.brands||'';merged.unit ||= p.quantity||p.product_quantity_unit||'';merged.image ||= p.image_front_url||p.image_url||'';merged.cat ||= mapCategory(p,item.source.key)}merged.cat=normalizeDepartment(merged.cat);merged.subcat=guessSubcategory(merged.cat,merged.name);return merged}
function fillProductFromLookup(data){const f=$('#productForm');if(!f)return;f.elements.barcode.value=data.barcode||'';if(data.brand)f.elements.brand.value=data.brand;if(data.name)f.elements.name.value=data.name;if(data.cat)setupCategoryControls(data.cat,data.subcat||guessSubcategory(data.cat,data.name));if(data.unit)f.elements.unit.value=data.unit;if(data.image)f.elements.image.value=data.image;if(!f.elements.emoji.value)f.elements.emoji.value='🛒';f.elements.name.focus();updateProductPreview();f.scrollIntoView({behavior:'smooth',block:'start'})}
async function queryOneDatabase(source,code){setDbState(source.key,'checking');const fields='code,product_name,product_name_pt,generic_name,generic_name_pt,brands,quantity,product_quantity_unit,categories,categories_tags,image_front_url,image_url';const url=`${source.url}/api/v2/product/${encodeURIComponent(code)}.json?fields=${encodeURIComponent(fields)}`;try{const r=await fetch(url,{headers:{'Accept':'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(j&&Number(j.status)===1&&j.product){setDbState(source.key,'found');return {source,product:j.product}}setDbState(source.key,'miss');return null}catch(err){setDbState(source.key,'error');return null}}
async function lookupBarcode(rawCode){if(!requireAdmin())return;const code=cleanBarcode(rawCode||$('#barcodeLookupInput').value);if(!code)return toast('Digite ou escaneie um código');$('#barcodeLookupInput').value=code;$('#lookupStatus').textContent='Consultando 4 bancos de dados...';resetDbStates();const results=await Promise.all(PRODUCT_DATABASES.map(src=>queryOneDatabase(src,code)));const found=results.filter(Boolean);if(!found.length){$('#lookupStatus').textContent='Código não encontrado nas 4 fontes. Você pode cadastrar manualmente.';const f=$('#productForm');f.elements.barcode.value=code;toast('Produto não encontrado');return}const data=mergeLookupResults(found,code);fillProductFromLookup(data);$('#lookupStatus').textContent=`Produto localizado em ${found.length} fonte${found.length>1?'s':''}. Cadastro preenchido automaticamente.`;toast('Produto encontrado e preenchido')}
async function startScanner(){if(!requireAdmin())return;if(!navigator.mediaDevices?.getUserMedia){toast('Câmera não disponível neste navegador');return}if(!('BarcodeDetector' in window)){toast('Leitor automático não é suportado neste navegador. Use a busca pelo código.');return}try{const supported=await BarcodeDetector.getSupportedFormats();const wanted=['qr_code','ean_13','ean_8','upc_a','upc_e','code_128','code_39','codabar','itf','data_matrix','aztec','pdf417'].filter(x=>supported.includes(x));const detector=new BarcodeDetector({formats:wanted.length?wanted:supported});scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});const video=$('#scannerVideo');video.srcObject=scannerStream;await video.play();$('#cameraBox').hidden=false;$('#stopScannerBtn').hidden=false;$('#startScannerBtn').hidden=true;$('#lookupStatus').textContent='Câmera ativa. Aponte para um código de barras ou QR Code.';const scan=async()=>{if(!scannerStream||scannerBusy)return;scannerBusy=true;try{const codes=await detector.detect(video);if(codes.length){const item=codes[0];await handleScannedValue(item.rawValue,item.format);return}}catch(e){}finally{scannerBusy=false}scannerTimer=setTimeout(scan,260)};scan()}catch(err){stopScanner();toast(err?.name==='NotAllowedError'?'Permissão da câmera negada':'Não foi possível abrir a câmera');$('#lookupStatus').textContent='Não foi possível iniciar a câmera.'}}
function stopScanner(){if(scannerTimer){clearTimeout(scannerTimer);scannerTimer=null}if(scannerStream){scannerStream.getTracks().forEach(t=>t.stop());scannerStream=null}const v=$('#scannerVideo');if(v)v.srcObject=null;if($('#cameraBox'))$('#cameraBox').hidden=true;if($('#stopScannerBtn'))$('#stopScannerBtn').hidden=true;if($('#startScannerBtn'))$('#startScannerBtn').hidden=false;scannerBusy=false}
async function handleScannedValue(raw,format){const value=String(raw||'').trim();stopScanner();if(format==='qr_code'){$('#qrResult').hidden=false;$('#qrResult').textContent='QR lido: '+value;const code=barcodeFromQr(value);if(code){$('#barcodeLookupInput').value=code;await lookupBarcode(code)}else{$('#lookupStatus').textContent='QR Code lido com sucesso, mas ele não contém um código de produto reconhecível.';toast('QR Code lido')}}else{$('#qrResult').hidden=true;$('#barcodeLookupInput').value=value;await lookupBarcode(value)}}

function renderAll(){renderCategories();renderProducts();renderCartBar();const addr=profile.address||localStorage.getItem('mercado_address');$('#deliveryAddress').textContent=addr||'Cadastre seu endereço';if($('#homeCustomerName'))$('#homeCustomerName').textContent=profile.name||'Faça seu cadastro';if($('#homeCustomerHint'))$('#homeCustomerHint').textContent=profile.email||'Entre no perfil para salvar seus dados'}
$('#searchInput').oninput=renderProducts;$('#sortSelect').onchange=renderProducts;
$('#cartBtn').onclick=()=>{renderCart();$('#cartDrawer').classList.add('open');$('#overlay').classList.add('show')};$('#closeCart').onclick=$('#overlay').onclick=()=>{$('#cartDrawer').classList.remove('open');$('#overlay').classList.remove('show')};
$('#showOffersBtn').onclick=()=>{onlyOffers=true;onlyFavorites=false;selectedCat='Todos';renderAll();$('#catalogTitle').scrollIntoView({behavior:'smooth'})};$('#favoritesBtn').onclick=()=>{onlyFavorites=true;onlyOffers=false;selectedCat='Todos';renderAll()};$('#freeShipBtn').onclick=()=>toast('Frete grátis acima de R$ 100');$('#couponsBtn').onclick=()=>toast('Use o cupom MERCADO10');$('#repeatBtn').onclick=()=>{const orders=getCustomerOrders();if(!orders.length)return toast('Nenhum pedido anterior nesta conta');repeatOrder(orders[0].id)};
$$('.mode-btn').forEach(b=>b.onclick=()=>{orderMode=b.dataset.mode;$$('.mode-btn').forEach(x=>x.classList.toggle('active',x===b));renderCart()});$('#applyCouponBtn').onclick=()=>{const c=$('#couponInput').value.trim().toUpperCase();coupon=c==='MERCADO10'?c:'';toast(coupon?'Cupom aplicado: 10% OFF':'Cupom inválido');renderCart()};
$('#checkoutBtn').onclick=()=>{if(!totals().count)return toast('Adicione produtos primeiro');$('#cartDrawer').classList.remove('open');$('#overlay').classList.remove('show');const f=$('#checkoutForm');f.elements.name.value=profile.name||'';f.elements.phone.value=profile.phone||'';f.elements.email.value=profile.email||'';const addr=profile.address||profile.address||'';f.elements.address.value=addr;$('#addressField').style.display=orderMode==='pickup'?'none':'block';f.elements.address.required=orderMode!=='pickup';$('#checkoutTotal').textContent=fmt(totals().total);openModal('#checkoutModal')};
$$('[data-close]').forEach(b=>{
  const doClose=(ev)=>{
    if(ev){ev.preventDefault();ev.stopPropagation();}
    if(b.dataset.close==='#adminModal')stopScanner();
    closeModal(b.dataset.close);
  };
  b.onclick=doClose;
});
const profileCloseBtn=$('#profileCloseBtn');
if(profileCloseBtn){
  const closeProfileNow=(ev)=>forceCloseProfile(ev);
  ['pointerdown','touchstart','touchend','click'].forEach(type=>profileCloseBtn.addEventListener(type,closeProfileNow,{capture:true,passive:false}));
}
$('#addressBtn').onclick=()=>{const a=profile.address||'';$('#addressForm').elements.address.value=a;openModal('#addressModal')};$('#addressForm').onsubmit=async e=>{e.preventDefault();const a=new FormData(e.target).get('address').trim();const next={...profile,address:a};try{if(!window.firebaseBackend?.saveProfile)throw new Error('Firebase indisponível');await window.firebaseBackend.saveProfile(next);profile=next;renderAll();closeModal('#addressModal');toast('Endereço salvo no banco e no navegador')}catch(err){toast('Falha no banco. Endereço não foi salvo localmente')}};
$('#checkoutForm').onsubmit=async e=>{e.preventDefault();const btn=e.target.querySelector('button[type=submit]');const oldText=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent='Salvando no banco...'}try{const t=totals(),fd=new FormData(e.target),data=Object.fromEntries(fd);if(orderMode==='pickup')data.address='Retirada no mercado';for(const [pid,q] of Object.entries(cart)){const p=products.find(x=>x.id==pid);if(!p||!p.active||q>p.stock){toast('O estoque mudou. Revise o carrinho.');renderAll();return}}const order={id:'PED'+Date.now().toString().slice(-6),date:new Date().toISOString(),customer:data,items:Object.entries(cart),subtotal:t.subtotal,discount:t.discount,delivery:t.delivery,total:t.total,mode:orderMode,status:'Recebido'};const nextProfile={...profile,name:data.name,phone:data.phone,email:data.email,address:orderMode==='delivery'?data.address:(profile.address||'')};if(!window.firebaseBackend?.commitOrder)throw new Error('Firebase indisponível');await window.firebaseBackend.commitOrder(order,{...cart},nextProfile);profile=nextProfile;cart={};coupon='';persist();closeModal('#checkoutModal');$('#successText').textContent=`${order.id} • ${fmt(order.total)} • ${orderMode==='delivery'?'Entrega':'Retirada'}`;openModal('#successModal');renderAll()}catch(err){console.error(err);toast(err?.message||'Falha ao salvar pedido no banco. Nada foi salvo localmente')}finally{if(btn){btn.disabled=false;btn.textContent=oldText}}};
$('#ordersBtn').onclick=()=>{renderOrders();openModal('#ordersModal')};function openProfile(){renderProfile();openModal('#profileModal')}$('#profileForm').onsubmit=async e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target));
  const enteredEmail=(d.email||'').trim().toLowerCase();
  const enteredPassword=(d.password||'').trim();

  const nextProfile={
    name:(d.name||'').trim(),
    phone:(d.phone||'').trim(),
    email:(d.email||'').trim(),
    address:(d.address||'').trim()
  };

  try{
    if(enteredEmail===ADMIN_EMAIL.toLowerCase()){
      if(!enteredPassword){
        toast('Digite a senha da conta administradora');
        return;
      }
      if(!window.firebaseBackend?.loginAdmin){
        throw new Error('Firebase Authentication indisponível');
      }

      await window.firebaseBackend.loginAdmin(enteredEmail,enteredPassword);
      isAdmin=true;
      sessionStorage.setItem('mercado_admin_session','1');
    }else{
      isAdmin=false;
      sessionStorage.removeItem('mercado_admin_session');
    }

    profile=nextProfile;

    if(window.firebaseBackend?.saveProfile){
      await window.firebaseBackend.saveProfile(profile);
    }else{
      throw new Error('Firebase indisponível');
    }

    renderAll();
    renderProfile();
    if(typeof updateAdvancedProfile==='function') updateAdvancedProfile();
    toast(isAdminAccount()?'Administrador conectado':'Perfil salvo');
  }catch(err){
    console.error('Login/perfil:',err);
    if(enteredEmail===ADMIN_EMAIL.toLowerCase()){
      isAdmin=false;
      sessionStorage.removeItem('mercado_admin_session');
    }
    const code=String(err?.code||'');
    let msg='Falha ao salvar perfil';
    if(code.includes('invalid-credential')||code.includes('wrong-password')) msg='Senha incorreta';
    else if(code.includes('user-not-found')) msg='Administrador não cadastrado no Firebase Authentication';
    else if(code.includes('too-many-requests')) msg='Muitas tentativas. Aguarde e tente novamente';
    else if(code.includes('network-request-failed')) msg='Sem conexão com o Firebase';
    else if(err?.message) msg=err.message;
    toast(msg);
    renderProfile();
  }
};
$('#adminAccessBtn').onclick=()=>{if(!isAdminAccount()){toast('Acesso administrativo não disponível para esta conta');return}closeModal('#profileModal');renderAdmin();openModal('#adminModal')};
$('#adminLoginForm').onsubmit=async e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target));
  const email=(d.email||'').trim().toLowerCase();
  const password=(d.password||'').trim();
  const btn=e.target.querySelector('button[type="submit"]');
  const oldText=btn?.textContent||'Entrar';

  if(email!==ADMIN_EMAIL.toLowerCase()){
    toast('Este e-mail não tem acesso administrativo');
    return;
  }
  if(!password){
    toast('Digite a senha do administrador');
    return;
  }

  try{
    if(btn){btn.disabled=true;btn.textContent='Entrando...'}
    if(!window.firebaseBackend?.loginAdmin){
      throw new Error('Firebase Authentication indisponível');
    }

    await window.firebaseBackend.loginAdmin(email,password);
    isAdmin=true;
    sessionStorage.setItem('mercado_admin_session','1');
    profile={...profile,email:ADMIN_EMAIL};

    if(window.firebaseBackend?.saveProfile){
      await window.firebaseBackend.saveProfile(profile);
    }

    e.target.reset();
    closeModal('#adminLoginModal');
    renderAdmin();
    openModal('#adminModal');
    renderProfile();
    toast('Administrador conectado ao Firebase');
  }catch(err){
    console.error('ADM login:',err);
    isAdmin=false;
    sessionStorage.removeItem('mercado_admin_session');
    const code=String(err?.code||'');
    let msg='E-mail ou senha inválidos';
    if(code.includes('invalid-credential')||code.includes('wrong-password')) msg='Senha incorreta';
    else if(code.includes('user-not-found')) msg='Administrador não cadastrado no Firebase Authentication';
    else if(code.includes('too-many-requests')) msg='Muitas tentativas. Aguarde e tente novamente';
    else if(code.includes('network-request-failed')) msg='Sem conexão com o Firebase';
    toast(msg);
  }finally{
    if(btn){btn.disabled=false;btn.textContent=oldText}
  }
};
$('#adminLogoutBtn').onclick=()=>{isAdmin=false;sessionStorage.removeItem('mercado_admin_session');closeModal('#adminModal');renderProfile();toast('Sessão administrativa encerrada')};
$$('[data-admin-tab]').forEach(b=>b.onclick=()=>{if(!requireAdmin())return;const tab=b.dataset.adminTab;$$('[data-admin-tab]').forEach(x=>x.classList.toggle('active',x.dataset.adminTab===tab));$('#adminDashboardPane').classList.toggle('active',tab==='dashboard');$('#adminCatalogPane').classList.toggle('active',tab==='catalog');$('#adminOrdersPane').classList.toggle('active',tab==='orders');if(tab==='dashboard'||tab==='catalog')renderAdmin()});
$('#clearProductBtn').onclick=()=>{clearProductForm();$('#barcodeLookupInput').value='';$('#qrResult').hidden=true;$('#lookupStatus').textContent='Pronto para leitura.';resetDbStates()};
$('#startScannerBtn').onclick=startScanner;$('#stopScannerBtn').onclick=stopScanner;$('#barcodeLookupBtn').onclick=()=>lookupBarcode();$('#barcodeLookupInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();lookupBarcode()}});
$('#productForm').onsubmit=async e=>{e.preventDefault();if(!requireAdmin())return;const btn=e.target.querySelector('button[type=submit]');const oldText=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent='Salvando no banco...'}try{const d=Object.fromEntries(new FormData(e.target));const newId=d.id?+d.id:Date.now(),finalCat=normalizeDepartment(d.cat),finalSub=(d.subcat||'').trim()||guessSubcategory(finalCat,d.name);const obj={id:newId,barcode:(d.barcode||'').trim(),sku:(d.sku||'').trim(),brand:(d.brand||'').trim(),name:d.name.trim(),cat:finalCat,subcat:finalSub,storagePath:productStoragePath(finalCat,finalSub,newId),unit:d.unit.trim(),description:(d.description||'').trim(),price:+d.price,cost:d.cost?+d.cost:0,oldPrice:d.oldPrice?+d.oldPrice:0,emoji:(d.emoji||'').trim()||'🛒',image:(d.image||'').trim(),stock:Math.max(0,parseInt(d.stock||0,10)),minStock:Math.max(0,parseInt(d.minStock||5,10)),location:(d.location||'').trim(),active:e.target.elements.active.checked};const existed=products.some(p=>p.id===obj.id);if(!window.firebaseBackend?.saveProduct)throw new Error('Firebase indisponível');await window.firebaseBackend.saveProduct(obj);clearProductForm();renderAll();renderAdmin();toast(existed?'Produto atualizado no banco e no navegador':'Produto cadastrado no banco e no navegador')}catch(err){console.error(err);toast('Falha no banco. Produto não foi salvo localmente')}finally{if(btn){btn.disabled=false;btn.textContent=oldText}}};
function updateMarginPreview(){const f=$('#productForm'),box=$('#marginPreview');if(!f||!box)return;const cost=Number(f.elements.cost?.value||0),price=Number(f.elements.price?.value||0);let text='—';if(price>0&&cost>=0){const m=((price-cost)/price)*100;text=`${m.toFixed(1).replace('.',',')}% · ${fmt(price-cost)} por unidade`}box.querySelector('strong').textContent=text}
function updateProductPreview(){const f=$('#productForm'),box=$('#productImagePreview');if(!f||!box)return;const url=(f.elements.image?.value||'').trim(),emoji=(f.elements.emoji?.value||'').trim()||'🛒';box.innerHTML=url?`<span>Prévia</span><img src="${url}" alt="Prévia" onerror="this.remove();this.parentElement.innerHTML='<span>Imagem indisponível</span><strong>${emoji}</strong>'">`:`<span>Prévia do produto</span><strong>${emoji}</strong>`}
if($('#productForm')){['cost','price'].forEach(n=>$('#productForm').elements[n]?.addEventListener('input',updateMarginPreview));['image','emoji'].forEach(n=>$('#productForm').elements[n]?.addEventListener('input',updateProductPreview))}
if($('#productCategorySelect'))$('#productCategorySelect').addEventListener('change',e=>setupCategoryControls(e.target.value,''));
if($('#productSubcategorySelect'))$('#productSubcategorySelect').addEventListener('change',updateCategoryPath);
if($('#categoryFinder'))$('#categoryFinder').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const buttons=$$('#categoryQuickButtons [data-dept]');buttons.forEach(b=>{const dept=b.dataset.dept;const hay=(dept+' '+(MARKET_DEPARTMENTS[dept]||[]).join(' ')).toLowerCase();b.hidden=!!q&&!hay.includes(q)});const exact=Object.keys(MARKET_DEPARTMENTS).find(dept=>(dept+' '+MARKET_DEPARTMENTS[dept].join(' ')).toLowerCase().includes(q));if(q&&exact){const match=(MARKET_DEPARTMENTS[exact]||[]).find(x=>x.toLowerCase().includes(q));if(match)setupCategoryControls(exact,match)}});
if($('#categoryTotalBadge'))$('#categoryTotalBadge').textContent=`${Object.keys(MARKET_DEPARTMENTS).length} departamentos · ${Object.values(MARKET_DEPARTMENTS).reduce((n,a)=>n+a.length,0)} categorias`;
if($('#productForm')?.elements.name)$('#productForm').elements.name.addEventListener('blur',()=>{const c=$('#productCategorySelect')?.value,s=$('#productSubcategorySelect')?.value;if(c&&(!s||s===(MARKET_DEPARTMENTS[c]||[])[0]))setupCategoryControls(c,guessSubcategory(c,$('#productForm').elements.name.value))});
setupCategoryControls('Mercearia','');
if($('#adminProductSearch'))$('#adminProductSearch').addEventListener('input',()=>renderAdmin());
if($('#dashboardNewProductBtn'))$('#dashboardNewProductBtn').onclick=()=>{const btn=$$('[data-admin-tab]').find(x=>x.dataset.adminTab==='catalog');if(btn)btn.click();setTimeout(()=>$('#productForm').scrollIntoView({behavior:'smooth'}),80)};
if($('#focusScannerBtn'))$('#focusScannerBtn').onclick=()=>$('#startScannerBtn').scrollIntoView({behavior:'smooth',block:'center'});
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false});$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').hidden=true};if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

const profileModalEl=$('#profileModal');
if(profileModalEl){
  profileModalEl.addEventListener('click',ev=>{if(ev.target===profileModalEl)closeModal('#profileModal')});
}
renderAll();


// ===== PERFIL AVANÇADO =====
function updateAdvancedProfile(){
  try{
    const p=profile||{};
    const orders=JSON.parse(localStorage.getItem('mercado_orders')||'[]');
    const favs=JSON.parse(localStorage.getItem('mercado_favorites')||'[]');
    const fmtMoney=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    const name=p.name||'Faça seu cadastro';
    const email=p.email||'Seu e-mail aparecerá aqui';
    const phone=p.phone||'Não informado';
    const address=p.address||profile.address||'Não informado';
    const total=orders.reduce((s,o)=>s+Number(o.total||0),0);

    const setText=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
    setText('profileDisplayName',name);
    setText('profileDisplayEmail',email);
    setText('profilePhoneView',phone);
    setText('profileAddressView',address);
    setText('profileEmailView',email==='Seu e-mail aparecerá aqui'?'Não informado':email);
    const purchasedQtyAdvanced=orders.reduce((sum,o)=>sum+(Array.isArray(o.items)?o.items.reduce((s,item)=>s+Number(item?.[1]||0),0):0),0);
    setText('profileOrderCount',purchasedQtyAdvanced);
    setText('profileSpentTotal',fmtMoney(total));
    setText('profileFavoriteCount',favs.length);

    const avatar=document.getElementById('profileAvatarLg');
    if(avatar){
      const initial=(name&&name!=='Faça seu cadastro')?name.trim().charAt(0).toUpperCase():'👤';
      avatar.textContent=initial;
    }
  }catch(e){console.warn('Perfil avançado:',e)}
}

document.addEventListener('click',e=>{
  const t=e.target.closest && e.target.closest('#profileOrdersShortcut,#profileFavoritesShortcut,#profileAddressShortcut');
  if(!t)return;
  if(t.id==='profileOrdersShortcut'){
    closeModal?.('#profileModal');
    document.getElementById('ordersBtn')?.click();
  }else if(t.id==='profileFavoritesShortcut'){
    closeModal?.('#profileModal');
    document.getElementById('favoritesBtn')?.click();
  }else if(t.id==='profileAddressShortcut'){
    const input=document.querySelector('#profileForm [name="address"]');
    if(input){input.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>input.focus(),350)}
  }
});


document.addEventListener('click',e=>{
  const target=e.target.closest && e.target.closest('#profileBtn,#profileTopBtn,[data-open="#profileModal"]');
  if(target) setTimeout(updateAdvancedProfile,80);
});
const pf=document.getElementById('profileForm');
if(pf) pf.addEventListener('submit',()=>setTimeout(updateAdvancedProfile,250));
window.addEventListener('storage',e=>{
  if(['mercado_orders','mercado_favorites'].includes(e.key)) updateAdvancedProfile();
});
setTimeout(updateAdvancedProfile,300);


// ===== V15.7 - ACESSO ROBUSTO AO PERFIL =====
function openUserProfile(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();}
  const modal=document.getElementById('profileModal');
  if(!modal) return;
  modal.style.display='flex';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(typeof updateAdvancedProfile==='function'){
    try{updateAdvancedProfile()}catch(e){console.warn(e)}
  }
}
window.openUserProfile=openUserProfile;

['profileTopBtn','profileBtn'].forEach(id=>{
  const btn=document.getElementById(id);
  if(!btn)return;
  btn.setAttribute('type','button');
  btn.onclick=openUserProfile;
  btn.addEventListener('pointerup',openUserProfile,{passive:false});
  btn.addEventListener('touchend',openUserProfile,{passive:false});
});

document.addEventListener('click',e=>{
  const el=e.target.closest && e.target.closest('#profileTopBtn,#profileBtn');
  if(el) openUserProfile(e);
});

// V15.7 - garantir Perfil no topo e rodapé após carregar DOM
window.addEventListener('DOMContentLoaded',()=>{
  ['profileTopBtn','profileBtn'].forEach(id=>{
    const btn=document.getElementById(id);
    if(!btn)return;
    btn.type='button';
    btn.onclick=openUserProfile;
    btn.style.pointerEvents='auto';
    btn.style.touchAction='manipulation';
  });
});


// V15.7 - reforço dos botões em Meus pedidos
document.addEventListener('click',e=>{
  const btn=e.target.closest && e.target.closest('[data-repeat-order]');
  if(!btn)return;
  e.preventDefault();
  e.stopPropagation();
  if(typeof repeatOrder==='function') repeatOrder(btn.dataset.repeatOrder);
});


// ===== V15.7 - PERFIL: TOPO E RODAPÉ =====
function openProfileReliable(ev){
  if(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }
  try{
    if(typeof renderProfile==='function') renderProfile();
    if(typeof updateAdvancedProfile==='function') updateAdvancedProfile();
  }catch(err){
    console.warn('Atualização do perfil:',err);
  }

  const modal=document.getElementById('profileModal');
  if(!modal) return;

  modal.removeAttribute('hidden');
  modal.style.display='flex';
  modal.style.visibility='visible';
  modal.style.opacity='1';
  modal.style.pointerEvents='auto';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
window.openProfileReliable=openProfileReliable;

function bindProfileButtons(){
  ['topProfileBtn','profileBtn'].forEach(id=>{
    const btn=document.getElementById(id);
    if(!btn) return;
    btn.type='button';
    btn.style.pointerEvents='auto';
    btn.style.touchAction='manipulation';
    btn.style.cursor='pointer';

    // replace clone to remove any stale listeners
    const clean=btn.cloneNode(true);
    btn.parentNode.replaceChild(clean,btn);

    clean.addEventListener('click',openProfileReliable,{passive:false});
    clean.addEventListener('pointerup',ev=>{
      if(ev.pointerType==='touch') openProfileReliable(ev);
    },{passive:false});
  });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',bindProfileButtons,{once:true});
}else{
  bindProfileButtons();
}


// V15.7 - ações dos produtos compatíveis com IDs do Firebase
document.addEventListener('click',e=>{
  const editBtn=e.target.closest && e.target.closest('[data-edit-product]');
  if(editBtn){
    e.preventDefault();
    e.stopPropagation();
    editProduct(editBtn.dataset.editProduct);
    return;
  }

  const deleteBtn=e.target.closest && e.target.closest('[data-delete-product]');
  if(deleteBtn){
    e.preventDefault();
    e.stopPropagation();
    deleteProduct(deleteBtn.dataset.deleteProduct);
  }
});


// V15.7 — botão "Voltar às compras" da confirmação do pedido
document.addEventListener('click', function(e){
  const btn = e.target.closest && e.target.closest(
    '#orderSuccess button, #successModal button, #orderConfirmed button, .order-success button, .success-modal button, [data-back-shopping]'
  );
  if(!btn) return;

  const label=(btn.textContent||'').trim().toLowerCase();
  if(!label.includes('voltar') || !label.includes('compra')) return;

  e.preventDefault();
  e.stopPropagation();

  ['orderSuccess','successModal','orderConfirmed','checkoutSuccess'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){
      el.hidden=true;
      el.classList.remove('open','active','show');
      el.style.display='none';
    }
  });

  document.querySelectorAll('.order-success,.success-modal,.checkout-success').forEach(el=>{
    el.hidden=true;
    el.classList.remove('open','active','show');
    el.style.display='none';
  });

  document.body.classList.remove('modal-open','no-scroll');
  document.documentElement.classList.remove('modal-open','no-scroll');

  const admin=document.getElementById('adminModal');
  if(!admin || admin.hidden || !admin.classList.contains('open')){
    window.scrollTo({top:0,behavior:'smooth'});
  }
}, true);
