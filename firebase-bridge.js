(() => {
  const cfg=window.FIREBASE_CONFIG||{};
  const adminEmail=(window.FIREBASE_ADMIN_EMAIL||'diel_zi_nho25@hotmail.com').toLowerCase();
  const configured=!!(cfg.apiKey&&cfg.authDomain&&cfg.databaseURL&&cfg.projectId);
  let app=null,auth=null,db=null,storage=null,currentUser=null;
  let productListener=null,orderListener=null,userListener=null;
  const clean=o=>JSON.parse(JSON.stringify(o,(k,v)=>v===undefined?null:v));
  const normalizeId=v=>{const n=Number(v);return Number.isFinite(n)&&String(n)===String(v)?n:v};
  function status(text,ok=false){
  const el=document.getElementById('profileDbStatus');
  if(!el) return;
  const label=el.querySelector('.profile-db-label');
  const dot=el.querySelector('.profile-db-dot');
  if(label) label.textContent=ok?'🔥 Realtime Database online':String(text||'Firebase offline');
  if(dot) dot.dataset.state=ok?'online':'offline';
}
function ensureDb(){if(!db)throw new Error('Firebase indisponível');}
  function ensureUser(){if(!currentUser)throw new Error('Usuário não autenticado');}
  function ensureAdmin(){ensureUser();if((currentUser.email||'').toLowerCase()!==adminEmail)throw new Error('Acesso administrativo negado');}
  function remoteProductsToArray(val){if(!val)return[];return Object.entries(val).map(([key,p])=>({id:normalizeId(p?.id??key),...(p||{})})).map(p=>({...p,price:+p.price||0,cost:+p.cost||0,oldPrice:+p.oldPrice||0,stock:+p.stock||0,minStock:+p.minStock||0,active:p.active!==false})).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'))}
  function cacheProducts(list){localStorage.setItem('mercado_products',JSON.stringify(list))}
  function cacheOrders(list){
    const unique=[];
    const seen=new Set();
    for(const o of (Array.isArray(list)?list:[])){
      const key=String(o?.id||'');
      if(!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(o);
    }
    localStorage.setItem('mercado_orders',JSON.stringify(unique));
  }
  function cacheProfile(p){profile={...profile,...(p||{})}} // PERFIL SOMENTE FIREBASE: sem localStorage
  async function ensureAuth(){await new Promise(resolve=>{const off=auth.onAuthStateChanged(u=>{off();currentUser=u;resolve()})});if(!currentUser){
      try{
        const cred=await auth.signInAnonymously();
        currentUser=cred.user;
      }catch(err){
        console.error('Anonymous Auth:',err);
        throw new Error('Ative Anonymous em Firebase Authentication > Sign-in method');
      }
    }}
  function attachProductsListener(){if(productListener)db.ref('products').off('value',productListener);productListener=snap=>{const remote=remoteProductsToArray(snap.val());products.splice(0,products.length,...remote);cacheProducts(products);renderAll?.();if(window.firebaseBackend.isAdmin)renderAdmin?.()};db.ref('products').on('value',productListener,e=>console.warn(e))}
  function attachProfileListener(){if(!currentUser)return;if(userListener)db.ref(`users/${currentUser.uid}`).off('value',userListener);userListener=snap=>{if(!snap.exists())return;profile={...profile,...snap.val()};cacheProfile(profile);renderAll?.();renderProfile?.()};db.ref(`users/${currentUser.uid}`).on('value',userListener,e=>console.warn(e))}
  function attachOrdersListener(){if(!currentUser)return;if(orderListener)db.ref('orders').off('value',orderListener);orderListener=snap=>{let list=Object.entries(snap.val()||{}).map(([key,o])=>({id:o?.id||key,...(o||{})}));if(!window.firebaseBackend.isAdmin)list=list.filter(o=>o.customerUid===currentUser.uid);list.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));cacheOrders(list);renderOrders?.();renderProfile?.();if(window.firebaseBackend.isAdmin)renderAdmin?.()};db.ref('orders').on('value',orderListener,e=>console.warn(e))}
  function attachRealtimeListeners(){attachProductsListener();attachProfileListener();attachOrdersListener()}
  async function loadRemoteDataOnce(){ensureDb();const [ps,us,os]=await Promise.all([db.ref('products').once('value'),currentUser?db.ref(`users/${currentUser.uid}`).once('value'):null,currentUser?db.ref('orders').once('value'):null]);const remote=remoteProductsToArray(ps.val());products.splice(0,products.length,...remote);cacheProducts(products);if(us?.exists()){profile={...profile,...us.val()};cacheProfile(profile)}if(os){let list=Object.entries(os.val()||{}).map(([key,o])=>({id:o?.id||key,...(o||{})}));if(!window.firebaseBackend.isAdmin)list=list.filter(o=>o.customerUid===currentUser.uid);list.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));cacheOrders(list)}renderAll?.();renderProfile?.();renderOrders?.()}

  window.firebaseBackend={async loginCustomer(email,password){ensureDb();const normalized=String(email||'').trim().toLowerCase();if(currentUser?.isAnonymous){try{await auth.signOut()}catch{}}const cred=await auth.signInWithEmailAndPassword(normalized,String(password||''));currentUser=cred.user;isAdmin=(currentUser.email||'').toLowerCase()===adminEmail;const snap=await db.ref(`users/${currentUser.uid}`).once('value');profile=snap.exists()?{...snap.val()}:{email:currentUser.email||normalized};attachRealtimeListeners();await loadRemoteDataOnce();return {...profile};},async registerCustomer(email,password,data){ensureDb();const normalized=String(email||'').trim().toLowerCase();if(String(password||'').length<6)throw new Error('A senha precisa ter pelo menos 6 caracteres');if(currentUser?.isAnonymous){try{await auth.signOut()}catch{}}const cred=await auth.createUserWithEmailAndPassword(normalized,String(password));currentUser=cred.user;isAdmin=false;const payload=clean({...data,email:currentUser.email||normalized,uid:currentUser.uid,updatedAt:firebase.database.ServerValue.TIMESTAMP});await db.ref(`users/${currentUser.uid}`).set(payload);profile={...payload};attachRealtimeListeners();await loadRemoteDataOnce();return {...profile};},
    async loginAdmin(email,password){
      ensureDb();
      const normalized=String(email||'').trim().toLowerCase();
      if(normalized!==adminEmail) throw new Error('E-mail sem permissão administrativa');
      const cred=await auth.signInWithEmailAndPassword(normalized,String(password||''));
      currentUser=cred.user;
      isAdmin=(currentUser.email||'').toLowerCase()===adminEmail;
      if(!isAdmin) throw new Error('Acesso administrativo negado');
      attachRealtimeListeners();
      await loadRemoteDataOnce();
      return {uid:currentUser.uid,email:currentUser.email};
    },

    get configured(){return configured},get connected(){return!!db},get user(){return currentUser},get isAdmin(){return!!currentUser&&(currentUser.email||'').toLowerCase()===adminEmail},
    async reload(){await loadRemoteDataOnce()},
    async saveProfile(nextProfile){ensureDb();ensureUser();const payload=clean({...nextProfile,email:nextProfile.email||currentUser.email||'',uid:currentUser.uid,updatedAt:firebase.database.ServerValue.TIMESTAMP});await db.ref(`users/${currentUser.uid}`).update(payload);profile={...profile,...nextProfile};cacheProfile(profile);status('🔥 Perfil confirmado no banco',true);return profile},
    async saveProduct(obj){ensureDb();ensureAdmin();const payload=clean({...obj,id:String(obj.id),updatedAt:firebase.database.ServerValue.TIMESTAMP});await db.ref(`products/${obj.id}`).set(payload);const normalized={...obj};const i=products.findIndex(p=>String(p.id)===String(obj.id));if(i>=0)products[i]=normalized;else products.push(normalized);cacheProducts(products);status('🔥 Produto confirmado no banco',true);return normalized},
    async deleteProduct(id){ensureDb();ensureAdmin();await db.ref(`products/${id}`).remove();products=products.filter(p=>String(p.id)!==String(id));cacheProducts(products);status('🔥 Exclusão confirmada no banco',true)},
    async updateOrderStatus(id,newStatus){ensureDb();ensureAdmin();await db.ref(`orders/${id}`).update({status:newStatus,updatedAt:firebase.database.ServerValue.TIMESTAMP});const orders=getOrders();const o=orders.find(x=>String(x.id)===String(id));if(o)o.status=newStatus;cacheOrders(orders);status('🔥 Status confirmado no banco',true)},
    async deleteOrder(id){ensureDb();ensureAdmin();await db.ref(`orders/${id}`).remove();cacheOrders(getOrders().filter(o=>String(o.id)!==String(id)));status('🔥 Pedido removido do banco',true)},
    async commitOrder(order,cartSnapshot,nextProfile){ensureDb();ensureUser();const productSnaps=await Promise.all(Object.keys(cartSnapshot).map(id=>db.ref(`products/${id}`).once('value')));const updates={};for(let k=0;k<productSnaps.length;k++){const id=Object.keys(cartSnapshot)[k],p=productSnaps[k].val(),q=Number(cartSnapshot[id]||0);if(!p||p.active===false||Number(p.stock||0)<q)throw new Error(`Estoque insuficiente para ${p?.name||'um produto'}`);updates[`products/${id}/stock`]=Number(p.stock||0)-q;updates[`products/${id}/updatedAt`]=firebase.database.ServerValue.TIMESTAMP}
      updates[`orders/${order.id}`]=clean({...order,id:order.id,customerUid:currentUser.uid,createdAt:firebase.database.ServerValue.TIMESTAMP});updates[`users/${currentUser.uid}`]=clean({...nextProfile,uid:currentUser.uid,email:nextProfile.email||currentUser.email||'',updatedAt:firebase.database.ServerValue.TIMESTAMP});await db.ref().update(updates);
      for(const [id,q] of Object.entries(cartSnapshot)){const p=products.find(x=>String(x.id)===String(id));if(p)p.stock=Math.max(0,Number(p.stock||0)-Number(q||0))}cacheProducts(products);profile={...profile,...nextProfile};cacheProfile(profile);status('🔥 Pedido confirmado no banco',true);return order}
  };

  if(!configured){window.addEventListener('load',()=>status('🔥 Firebase: configuração incompleta'));return}
  try{app=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);auth=firebase.auth();db=firebase.database();storage=firebase.storage();db.ref('.info/connected').on('value',snap=>status(snap.val()?'🔥 Realtime Database online':'Firebase offline',!!snap.val()))}catch(err){console.error(err);window.addEventListener('load',()=>status('Erro ao iniciar Firebase'));return}

  // Carrinho e favoritos são preferências locais. Dados sincronizados (produtos, pedidos e perfil) só entram no cache após confirmação do Firebase.
  const originalPersist=persist;persist=function(){localStorage.setItem('mercado_cart',JSON.stringify(cart));localStorage.setItem('mercado_favorites',JSON.stringify(favorites))};
  saveOrders=function(){throw new Error('Use Firebase para salvar pedidos')};

  if(document.getElementById('profileForm'))document.getElementById('profileForm').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const email=(d.email||'').trim(),pass=d.password||'';try{if(email.toLowerCase()===adminEmail){if(currentUser?.isAnonymous)await auth.signOut();const cred=await auth.signInWithEmailAndPassword(email,pass);currentUser=cred.user;isAdmin=true;sessionStorage.setItem('mercado_admin_session','1')}else{if(!currentUser||!currentUser.isAnonymous){try{await auth.signOut()}catch{}const cred=await auth.signInAnonymously();currentUser=cred.user}isAdmin=false;sessionStorage.removeItem('mercado_admin_session')}const next={name:(d.name||'').trim(),phone:(d.phone||'').trim(),email,address:(d.address||'').trim()};await window.firebaseBackend.saveProfile(next);attachRealtimeListeners();renderAll();renderProfile();toast(isAdmin?'Administrador conectado':'Perfil salvo no banco e no navegador')}catch(err){console.error(err);toast('Falha no banco/autenticação. Perfil não foi salvo localmente')}};
  if(document.getElementById('adminLoginForm'))document.getElementById('adminLoginForm').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));try{if(currentUser?.isAnonymous)await auth.signOut();const cred=await auth.signInWithEmailAndPassword((d.email||'').trim(),d.password||'');currentUser=cred.user;if((currentUser.email||'').toLowerCase()!==adminEmail){await auth.signOut();currentUser=null;throw new Error('not-admin')}isAdmin=true;sessionStorage.setItem('mercado_admin_session','1');const next={...profile,email:currentUser.email};await window.firebaseBackend.saveProfile(next);attachRealtimeListeners();await loadRemoteDataOnce();closeModal('#adminLoginModal');renderAdmin();openModal('#adminModal');toast('ADM conectado ao Realtime Database')}catch(err){toast('E-mail ou senha administrativos inválidos')}};
  const logoutBtn=document.getElementById('adminLogoutBtn');if(logoutBtn)logoutBtn.onclick=async()=>{try{await auth.signOut()}catch{}currentUser=null;isAdmin=false;sessionStorage.removeItem('mercado_admin_session');try{const cred=await auth.signInAnonymously();currentUser=cred.user}catch{}attachRealtimeListeners();closeModal('#adminModal');renderProfile();toast('Sessão administrativa encerrada')};
  (async()=>{try{await ensureAuth();auth.onAuthStateChanged(async u=>{currentUser=u;isAdmin=!!u&&(u.email||'').toLowerCase()===adminEmail;if(isAdmin)sessionStorage.setItem('mercado_admin_session','1');else if(!u?.email)sessionStorage.removeItem('mercado_admin_session');attachRealtimeListeners();try{await loadRemoteDataOnce()}catch(e){console.warn(e)}renderProfile?.()});attachRealtimeListeners();await loadRemoteDataOnce();status('🔥 Realtime Database conectado',true)}catch(e){console.error(e);status('Falha ao conectar Firebase')}})();
})();
