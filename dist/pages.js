const form=document.querySelector('.lead');
if(form){
 const colors={hero:'Grigio grafite',bosco:'Verde bosco',perla:'Bianco perla'};
 const key=new URLSearchParams(location.search).get('tinta');
 const chosen=form.querySelector('.chosen');
 if(Object.hasOwn(colors,key)){chosen.textContent='Tinta scelta: '+colors[key];chosen.hidden=false}
 let token=crypto.randomUUID();
 form.onsubmit=async ev=>{ev.preventDefault();const button=form.querySelector('button'),msg=form.querySelector('.response');button.disabled=true;msg.textContent='Invio in corso…';
 try{const data=Object.fromEntries(new FormData(form));if(!/^[+\d\s().-]+$/.test(data.telefono)||data.telefono.replace(/\D/g,'').length<7)throw Error('Controlla il numero di telefono.');
 const r=await fetch('/api/richieste',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,token,tinta:document.body.dataset.tinta||key,origine:location.pathname.split('/').pop()||'index.html'})});
 if(!r.ok)throw Error(r.status===400?'Controlla i recapiti inseriti.':'Invio non riuscito. Riprova o contattaci su WhatsApp.');form.reset();form.querySelector('.fields').hidden=true;button.hidden=true;msg.textContent='Richiesta ricevuta. Grazie! Un consulente FLORA ti ricontatterà ai recapiti indicati.'}
 catch(e){msg.textContent=e.message;button.disabled=false}}
}
