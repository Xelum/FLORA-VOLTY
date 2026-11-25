const mailOwner='alex.morneala@libero.it';
const states=['Nuova','Da richiamare','Contattata','Chiusa'];
const reply=(obj,status=200)=>Response.json(obj,{status,headers:{'Cache-Control':'no-store'}});
export default {async fetch(req,env){const u=new URL(req.url),path=u.pathname;try{
 const staff=req.headers.get('oai-authenticated-user-email')?.toLowerCase()===mailOwner;
 if((path.startsWith('/api/vendite')||path==='/vendite')&&!staff)return new Response('Area riservata al responsabile vendite.',{status:403,headers:{'Cache-Control':'no-store'}});
 if(req.method==='POST'){
 if(req.headers.get('origin')!==u.origin||!req.headers.get('content-type')?.startsWith('application/json'))return reply({},403);
 const raw=await req.text();if(raw.length>3000)return reply({},413);let b;try{b=JSON.parse(raw)}catch{return reply({},400)}if(!b||typeof b!=='object')return reply({},400);
 if(path==='/api/richieste'){
 const val=k=>typeof b[k]==='string'?b[k].trim():'';
 const nome=val('nome'),cognome=val('cognome'),telefono=val('telefono'),email=val('email'),token=val('token');
 if(!nome||!cognome||nome.length>70||cognome.length>70||!/^[-+\d ().]{7,28}$/.test(telefono)||!/^\d{7,15}$/.test(telefono.replace(/\D/g,''))||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!/^[-\da-f]{36}$/i.test(token))return reply({},400);
 const source={'index.html':'Showroom','acquisto.html':'Preordine','test-drive.html':'Test drive','contatti.html':'Contatti'};const colors={hero:'Grigio grafite',perla:'Bianco perla',bosco:'Verde bosco'};
 await env.DB.prepare('INSERT INTO richieste(token,nome,cognome,telefono,email,origine,tinta) VALUES(?,?,?,?,?,?,?) ON CONFLICT(token) DO NOTHING').bind(token,nome,cognome,telefono,email,Object.hasOwn(source,b.origine)?source[b.origine]:'Showroom',Object.hasOwn(colors,b.tinta)?colors[b.tinta]:'').run();return reply({ok:true},201)}
 if(path==='/api/vendite'&&Number.isSafeInteger(b.id)&&states.includes(b.stato)){await env.DB.prepare('UPDATE richieste SET stato=? WHERE id=?').bind(b.stato,b.id).run();return reply({ok:true})}
 return reply({},404)}
 if(req.method!=='GET'&&req.method!=='HEAD')return reply({},405);
 if(path==='/api/vendite'){let before=Number(u.searchParams.get('prima'))||Number.MAX_SAFE_INTEGER;return reply((await env.DB.prepare('SELECT id,nome,cognome,email,telefono,stato,origine,tinta,creata FROM richieste WHERE id<? ORDER BY id DESC LIMIT 50').bind(before).all()).results)}
 const item=files[path==='/'?'/index.html':path];if(!item)return reply({},404);return new Response(req.method==='HEAD'?null:Uint8Array.from(atob(item[1]),c=>c.charCodeAt(0)),{headers:{'Content-Type':item[0],'Cache-Control':path.startsWith('/assets/')?'public,max-age=86400':'no-store','X-Content-Type-Options':'nosniff'}})
 }catch{return reply({error:'Servizio non disponibile'},503)}}};
