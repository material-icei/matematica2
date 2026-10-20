/* ================= DATOS ================= */
const DINERO = [
  {id:'b500', v:500, tipo:'billete', img:'img/billete500.jpg'},
  {id:'b200', v:200, tipo:'billete', img:'img/billete200.jpg'},
  {id:'b100', v:100, tipo:'billete', img:'img/billete100.jpg'},
  {id:'b50',  v:50,  tipo:'billete', img:'img/billete50.jpg'},
  {id:'b20',  v:20,  tipo:'billete', img:'img/billete20.jpg'},
  {id:'b10',  v:10,  tipo:'billete', img:'img/billete10.jpg'},
  {id:'m10',  v:10,  tipo:'moneda',  img:'img/moneda10.png'},
  {id:'m5',   v:5,   tipo:'moneda',  img:'img/moneda5.png'},
  {id:'m1',   v:1,   tipo:'moneda',  img:'img/moneda1.png'}
];
const D = Object.fromEntries(DINERO.map(d => [d.id, d]));

const SUPER = [
  {e:'🧀', n:'queso'}, {e:'🌭', n:'salchichas'}, {e:'🥣', n:'cereales'}, {e:'🐟', n:'pescado'},
  {e:'🥤', n:'gaseosa'}, {e:'🍞', n:'pan'}, {e:'🥚', n:'huevos'}, {e:'🥛', n:'yogur'},
  {e:'🍎', n:'manzanas'}, {e:'🍪', n:'galletitas'}, {e:'🍫', n:'chocolate'}, {e:'🍌', n:'bananas'},
  {e:'🧃', n:'jugo'}, {e:'🍝', n:'fideos'}
];
const DEPORTE = [
  {e:'🧢', n:'gorra'}, {e:'🧦', n:'medias'}, {e:'👕', n:'camiseta'}, {e:'🔑', n:'llavero'},
  {e:'⚽', n:'pelota'}, {e:'🏆', n:'copa de juguete'}
];
const PERSONAS = [
  {e:'👦', n:'Federico'}, {e:'👧', n:'Martina'}, {e:'🧒', n:'Luciano'}, {e:'👩', n:'Camila'},
  {e:'👧🏽', n:'Juana'}, {e:'👵', n:'la abuela'}, {e:'👦🏻', n:'Julián'}, {e:'👩🏻', n:'María'},
  {e:'👦🏽', n:'Fran'}, {e:'👧🏻', n:'Alma'}
];
const FIGURITAS = [
  {id:'yaguarete', n:'Yaguareté', img:'img/billete500.jpg', req:'Terminá «¡A pagar!»'},
  {id:'ballena',   n:'Ballena',   img:'img/billete200.jpg', req:'Terminá «¿Le alcanza?»'},
  {id:'taruca',    n:'Taruca',    img:'img/billete100.jpg', req:'Terminá «Contar y completar»'},
  {id:'condor',    n:'Cóndor',    img:'img/billete50.jpg',  req:'Juntá 25 ⭐'},
  {id:'guanaco',   n:'Guanaco',   img:'img/billete20.jpg',  req:'Juntá 40 ⭐'}
];
const RONDAS = 5;

/* ================= ESTADO GUARDADO ================= */
let progresoGuardado = {estrellas:0, figuritas:[], porAct:{1:0,2:0,3:0}};
try{
  const g = JSON.parse(localStorage.getItem('billetesMonedas') || 'null');
  if(g) progresoGuardado = Object.assign(progresoGuardado, g);
}catch(e){}
function guardar(){ try{ localStorage.setItem('billetesMonedas', JSON.stringify(progresoGuardado)); }catch(e){} }

/* ================= UTILIDADES ================= */
const $ = s => document.querySelector(s);
const R = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const azar = arr => arr[Math.floor(Math.random()*arr.length)];
function mezclar(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];} return a; }
function precioLindo(a,b){ let p=R(a,b); if(p%10===0 && Math.random()<.7) p+=R(1,9); return Math.min(p,b); }

/* ================= SONIDO ================= */
let sonidoOn = true, ctxAudio = null;
function tono(frecs, dur=0.12, tipo='sine'){
  if(!sonidoOn) return;
  try{
    ctxAudio = ctxAudio || new (window.AudioContext||window.webkitAudioContext)();
    frecs.forEach((f,i)=>{
      const o=ctxAudio.createOscillator(), g=ctxAudio.createGain();
      o.type=tipo; o.frequency.value=f;
      const t=ctxAudio.currentTime+i*dur;
      g.gain.setValueAtTime(.18,t); g.gain.exponentialRampToValueAtTime(.001,t+dur*1.6);
      o.connect(g); g.connect(ctxAudio.destination); o.start(t); o.stop(t+dur*1.7);
    });
  }catch(e){}
}
const sBien = () => tono([523,659,784,1047],.1,'triangle');
const sMal  = () => tono([220,180],.16,'sawtooth');
const sClic = () => tono([880],.04,'square');
const sGran = () => tono([523,659,784,1047,784,1047,1319],.12,'triangle');
$('#btnSonido').onclick = () => { sonidoOn=!sonidoOn; $('#btnSonido').textContent = sonidoOn?'🔊':'🔇'; };

/* ================= ELEMENTOS DE DINERO ================= */
function elDinero(id, chica=false){
  const d = D[id];
  const el = document.createElement('div');
  el.className = 'dinero ' + (d.tipo==='billete'?'billete':'moneda') + (chica?' chica':'');
  if(d.img) el.style.backgroundImage = `url('${d.img}')`;
  else { el.classList.add('uno'); el.innerHTML = '<b>1</b><i>PESO</i>'; }
  el.title = `$${d.v} (${d.tipo})`;
  return el;
}

/* ================= ZONAS DE ARRASTRE ================= */
const zonas = {};   // nombre -> {el, items:[], textoVacio}
let zonaActiva = null;

function crearZona(nombre, textoVacio, emoji='👇'){
  const el = document.createElement('div');
  el.className = 'zona';
  el.dataset.zona = nombre;
  zonas[nombre] = {el, items:[], textoVacio, emoji};
  zonaActiva = nombre;
  dibujarZona(nombre);
  return el;
}
function sumaZona(n){ return zonas[n].items.reduce((s,id)=>s+D[id].v,0); }
function dibujarZona(n){
  const z = zonas[n];
  z.el.innerHTML = '';
  z.el.classList.remove('bien','mal');
  if(!z.items.length){
    z.el.innerHTML = `<div class="vacio"><div class="e">${z.emoji}</div>${z.textoVacio}</div>`;
    return;
  }
  DINERO.forEach(d=>{
    const cant = z.items.filter(x=>x===d.id).length;
    if(!cant) return;
    const g = document.createElement('div');
    g.className='grp'; g.title='Tocá para sacar uno';
    if(cant>1){ const p=elDinero(d.id,true); p.classList.add('pila'); g.appendChild(p); }
    g.appendChild(elDinero(d.id,true));
    if(cant>1){ const b=document.createElement('div'); b.className='badge'; b.textContent='×'+cant; g.appendChild(b); }
    g.onclick = () => { const i=z.items.lastIndexOf(d.id); z.items.splice(i,1); sClic(); dibujarZona(n); limpiarMensaje(); };
    z.el.appendChild(g);
  });
}
function agregarAZona(n, id){
  if(!zonas[n]) return;
  if(zonas[n].items.length >= 40) return;
  zonas[n].items.push(id); sClic(); dibujarZona(n); limpiarMensaje();
}

/* Banco con arrastre (pointer events: mouse, touchpad y pantalla táctil) */
function mostrarBanco(){
  const b = $('#banco'); b.innerHTML = '<div class="titulo">Arrastrá (o tocá) los billetes y monedas · Tocá uno de la caja para sacarlo</div>';
  DINERO.forEach(d=>{
    const it = elDinero(d.id); it.classList.add('item');
    it.addEventListener('pointerdown', e => iniciarArrastre(e, d.id, it));
    b.appendChild(it);
  });
  b.classList.remove('oculto');
}
let arrastre = null;
function iniciarArrastre(e, id, origen){
  e.preventDefault();
  arrastre = {id, x0:e.clientX, y0:e.clientY, fantasma:null, sobre:null};
  document.addEventListener('pointermove', moverArrastre);
  document.addEventListener('pointerup', soltarArrastre, {once:true});
  document.addEventListener('pointercancel', cancelarArrastre, {once:true});
}
function moverArrastre(e){
  if(!arrastre) return;
  if(!arrastre.fantasma){
    if(Math.hypot(e.clientX-arrastre.x0, e.clientY-arrastre.y0) < 6) return;
    arrastre.fantasma = elDinero(arrastre.id); arrastre.fantasma.classList.add('fantasma');
    document.body.appendChild(arrastre.fantasma);
  }
  arrastre.fantasma.style.left = e.clientX+'px'; arrastre.fantasma.style.top = e.clientY+'px';
  const z = zonaBajo(e.clientX, e.clientY);
  if(arrastre.sobre && arrastre.sobre!==z) arrastre.sobre.classList.remove('encima');
  if(z) z.classList.add('encima');
  arrastre.sobre = z;
}
function zonaBajo(x,y){ const el=document.elementFromPoint(x,y); return el ? el.closest('.zona') : null; }
function soltarArrastre(e){
  document.removeEventListener('pointermove', moverArrastre);
  if(!arrastre) return;
  if(arrastre.fantasma){
    const z = zonaBajo(e.clientX, e.clientY);
    arrastre.fantasma.remove();
    if(z){ z.classList.remove('encima'); agregarAZona(z.dataset.zona, arrastre.id); }
  } else if(zonaActiva){ agregarAZona(zonaActiva, arrastre.id); }  // toque = agregar
  if(arrastre.sobre) arrastre.sobre.classList.remove('encima');
  arrastre = null;
}
function cancelarArrastre(){
  document.removeEventListener('pointermove', moverArrastre);
  if(arrastre && arrastre.fantasma) arrastre.fantasma.remove();
  arrastre = null;
}

/* ================= FLUJO DEL JUEGO ================= */
let act = 0, ronda = 0, errores = 0, estrellasAct = 0, datos = null;

function irInicio(){
  $('#juego').classList.add('oculto'); $('#inicio').classList.remove('oculto');
  $('#btnInicio').classList.add('oculto'); $('#subtitulo').textContent='';
  $('#banco').classList.add('oculto');
  pintarInicio();
}
$('#btnInicio').onclick = irInicio;
document.querySelectorAll('.tarjeta').forEach(t => t.onclick = () => empezar(+t.dataset.act));

function pintarInicio(){
  $('#totalEstrellas').textContent = progresoGuardado.estrellas;
  for(let i=1;i<=3;i++){ const m=progresoGuardado.porAct[i]||0; $('#ea'+i).textContent = m? `Mejor: ${m} de 15 ⭐` : ''; }
  const f = $('#figuritas'); f.innerHTML='';
  FIGURITAS.forEach(fg=>{
    const ok = progresoGuardado.figuritas.includes(fg.id);
    f.insertAdjacentHTML('beforeend', `<div class="fig ${ok?'ok':''}"><div class="img" style="background-image:url('${fg.img}')"></div>${ok?fg.n:'¿?'}<small>${ok?'':fg.req}</small></div>`);
  });
}
$('#btnBorrar').onclick = () => {
  if(confirm('¿Borrar todas las estrellas y figuritas de esta computadora?')){
    progresoGuardado = {estrellas:0, figuritas:[], porAct:{1:0,2:0,3:0}}; guardar(); pintarInicio();
  }
};

const NOMBRES_ACT = {1:'· ¡A pagar!', 2:'· ¿Le alcanza?', 3:'· Contar y completar'};
function empezar(n){
  act=n; ronda=0; estrellasAct=0;
  $('#inicio').classList.add('oculto'); $('#juego').classList.remove('oculto');
  $('#btnInicio').classList.remove('oculto'); $('#subtitulo').textContent = NOMBRES_ACT[n];
  nuevaRonda();
}
function pintarProgreso(){
  const p = $('#progreso'); p.innerHTML='';
  for(let i=0;i<RONDAS;i++){
    p.insertAdjacentHTML('beforeend', `<div class="punto ${i<ronda?'hecho':''} ${i===ronda?'actual':''}">${i<ronda?'⭐':i+1}</div>`);
  }
}
function nuevaRonda(){
  errores=0; esquemas={}; for(const k in zonas) delete zonas[k]; zonaActiva=null;
  pintarProgreso();
  $('#banco').classList.add('oculto');
  if(act===1) ronda1(); else if(act===2) ronda2(); else ronda3();
}

/* Mensajes */
let elMensaje = null;
function mensaje(txt, tipo){ if(!elMensaje) return; elMensaje.className='mensaje '+tipo; elMensaje.innerHTML=txt; }
function limpiarMensaje(){ if(elMensaje && elMensaje.classList.contains('mal')){ elMensaje.className='mensaje'; elMensaje.innerHTML=''; } }
function marcar(input, ok){ input.classList.remove('bien','mal'); void input.offsetWidth; input.classList.add(ok?'bien':'mal'); }
function leer(input){ const v=input.value.replace(/[^0-9]/g,''); return v===''?null:parseInt(v,10); }
function fallo(txt){ errores++; sMal(); mensaje('🙈 '+txt, 'mal'); }

function rondaGanada(){
  const est = errores===0?3 : errores===1?2 : 1;
  estrellasAct += est;
  progresoGuardado.estrellas += est;
  revisarFiguritasPorEstrellas();
  guardar();
  $('#totalEstrellas').textContent = progresoGuardado.estrellas;
  const chip=$('#chipEstrellas'); chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop');
  sBien(); confeti(25);
  const frases = ['¡Muy bien!','¡Excelente!','¡Genial!','¡Lo lograste!','¡Bárbaro!'];
  const ultima = ronda===RONDAS-1;
  modal(`<h2>${azar(frases)}</h2>
    <div class="grandes">${[1,2,3].map(i=>`<span class="${i>est?'apagada':''}">⭐</span>`).join('')}</div>
    <p>${est===3?'¡Al primer intento!':'Ganaste '+est+' estrella'+(est>1?'s':'')+'. ¡Seguí así!'}</p>
    <button class="btn btn-verde" id="btnSeguir">${ultima?'Ver mi premio 🎁':'Siguiente ➜'}</button>`);
  $('#btnSeguir').onclick = () => { cerrarModal(); ronda++; if(ronda>=RONDAS) actividadTerminada(); else nuevaRonda(); };
}
function revisarFiguritasPorEstrellas(){
  if(progresoGuardado.estrellas>=25 && !progresoGuardado.figuritas.includes('condor')) progresoGuardado.figuritas.push('condor');
  if(progresoGuardado.estrellas>=40 && !progresoGuardado.figuritas.includes('guanaco')) progresoGuardado.figuritas.push('guanaco');
}
function actividadTerminada(){
  pintarProgreso();
  const fig = FIGURITAS[act-1];
  const nueva = !progresoGuardado.figuritas.includes(fig.id);
  if(nueva) progresoGuardado.figuritas.push(fig.id);
  progresoGuardado.porAct[act] = Math.max(progresoGuardado.porAct[act]||0, estrellasAct);
  guardar(); sGran(); confeti(80);
  const medalla = estrellasAct>=13?'🥇':estrellasAct>=9?'🥈':'🥉';
  modal(`<h2>${medalla} ¡Terminaste la actividad!</h2>
    <p>Juntaste <b style="color:#b07d00;font-size:26px">${estrellasAct} ⭐</b> de 15</p>
    <div class="premio" style="background-image:url('${fig.img}')"></div>
    <p>${nueva?'¡Ganaste la figurita del <b>'+fig.n+'</b>! 🎉':'Ya tenés la figurita del <b>'+fig.n+'</b>. ¡Jugá otra actividad!'}</p>
    <div style="display:flex;gap:12px;justify-content:center">
      <button class="btn btn-gris" id="btnOtra">🔁 Jugar otra vez</button>
      <button class="btn btn-verde" id="btnVolver">🏠 Inicio</button>
    </div>`);
  $('#btnOtra').onclick = () => { cerrarModal(); empezar(act); };
  $('#btnVolver').onclick = () => { cerrarModal(); irInicio(); };
}
function modal(html){ $('#capaModal').innerHTML = `<div class="overlay"><div class="modal">${html}</div></div>`; }
function cerrarModal(){ $('#capaModal').innerHTML=''; }
function confeti(n){
  const colores=['#f4b400','#2a9d8f','#e76f51','#3a86ff','#8e6ccf','#ff8fab'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div'); c.className='confeti';
    c.style.left=R(0,100)+'vw'; c.style.background=azar(colores);
    c.style.animationDuration=(R(18,35)/10)+'s'; c.style.animationDelay=(R(0,6)/10)+'s';
    c.style.borderRadius = Math.random()<.5?'50%':'2px';
    document.body.appendChild(c); setTimeout(()=>c.remove(),4500);
  }
}

/* Ayuda con el monto: botón para ver cuánto hay en la caja */
function botonVerSuma(nombreZona){
  const span = document.createElement('span'); span.className='ver-suma';
  const b = document.createElement('button'); b.className='btn btn-gris'; b.textContent='👀 ¿Cuánto puse?';
  b.onclick = () => { span.textContent = 'Pusiste $'+sumaZona(nombreZona); setTimeout(()=>span.textContent='',2500); };
  const vaciar = document.createElement('button'); vaciar.className='btn btn-gris'; vaciar.textContent='🗑️ Vaciar';
  vaciar.onclick = () => { zonas[nombreZona].items=[]; dibujarZona(nombreZona); };
  return [vaciar, b, span];
}
function htmlProducto(p){ return `<div class="producto"><div class="e">${p.e}</div><div class="n">${p.n}</div><div class="precio">$${p.precio}</div></div>`; }

/* ================= ACTIVIDAD 1: ¡A PAGAR! ================= */
function ronda1(){
  const [a,b] = mezclar(SUPER).slice(0,2);
  a.precio = precioLindo(100,520);
  b.precio = precioLindo(25, Math.min(470, 999-a.precio));
  const total = a.precio + b.precio;
  datos = {total};
  $('#consigna').innerHTML = `🛒 Hay que comprar <b>${a.n}</b> y <b>${b.n}</b>. ¿Cuánto hay que pagar? Después, <b>pagá justo</b> con billetes y monedas.`;
  const esc = $('#escena'); esc.innerHTML = '';
  esc.innerHTML = `
    <div class="panel izq">
      <h3>🏪 El súper</h3>
      <div class="productos">${htmlProducto(a)}<div class="mas">+</div>${htmlProducto(b)}</div>
      <div class="paso" style="margin-top:auto">
        <div class="pregunta"><span class="num-paso">1</span> ¿Cuánto cuestan las dos cosas juntas?
          <span class="campo">$<input id="inTotal" inputmode="numeric" maxlength="4" autocomplete="off"></span></div>
        <div class="lugar-esq" id="lugarEsq1"></div>
        <div class="pregunta"><span class="num-paso">2</span> Arrastrá a la caja la plata justa para pagar.</div>
      </div>
      <div class="mensaje" id="msg"></div>
    </div>
    <div class="panel der">
      <h3>🧺 La caja</h3>
      <div id="lugarZona" style="flex:1;display:flex;min-height:0"></div>
      <div class="acciones-zona" id="accZona"></div>
      <button class="btn btn-verde" id="btnVerificar">✔ Verificar</button>
    </div>`;
  elMensaje = $('#msg');
  $('#lugarZona').appendChild(crearZona('caja','Arrastrá acá los billetes y monedas','💵'));
  botonVerSuma('caja').forEach(x=>$('#accZona').appendChild(x));
  mostrarBanco();
  $('#lugarEsq1').appendChild(botonEsquema('suma','+',a.precio,b.precio,'Hacer el cálculo reflexivo'));
  const inp = $('#inTotal');
  inp.addEventListener('input', ()=>{ inp.classList.remove('mal','bien'); limpiarMensaje(); });
  $('#btnVerificar').onclick = () => {
    const v = leer(inp);
    if(v===null){ mensaje('✏️ Primero escribí cuánto hay que pagar.','info'); inp.focus(); return; }
    if(v!==total){ marcar(inp,false); fallo('La cuenta no da. Sumá de nuevo: primero los cienes, después los dieces y al final los unos.'); return; }
    marcar(inp,true);
    const s = sumaZona('caja');
    if(s===0){ mensaje('👍 ¡La cuenta está bien! Ahora arrastrá la plata a la caja.','info'); return; }
    if(s!==total){
      zonas.caja.el.classList.add('mal');
      fallo(s<total ? `En la caja hay $${s}. ¡Te faltan $${total-s}!` : `En la caja hay $${s}. ¡Pusiste $${s-total} de más!`);
      return;
    }
    zonas.caja.el.classList.add('bien');
    mensaje(`🎉 ¡Pagaste justo $${total}!`,'bien');
    setTimeout(rondaGanada, 600);
  };
}

/* ================= ACTIVIDAD 2: ¿LE ALCANZA? ================= */
function ronda2(){
  const persona = azar(PERSONAS);
  const lista = Math.random()<.5 ? SUPER : DEPORTE;
  const dos = Math.random()<.4;
  const prods = mezclar(lista).slice(0, dos?2:1);
  if(dos){ prods[0].precio = precioLindo(60,400); prods[1].precio = precioLindo(30, Math.min(420, 820-prods[0].precio)); }
  else prods[0].precio = precioLindo(90,780);
  const total = prods.reduce((s,p)=>s+p.precio,0);
  const alcanza = Math.random()<.7;
  let tiene;
  if(alcanza){ tiene = Math.random()<.35 ? Math.min(999, Math.ceil((total+1)/100)*100) : Math.min(999, total + R(5, Math.max(6, Math.min(350, 999-total)))); if(tiene<=total) tiene=total+R(1,9); }
  else { tiene = Math.max(10, total - R(8, Math.min(250, total-10))); }
  const dif = Math.abs(tiene-total);
  datos = {total, tiene, alcanza, dif};
  const que = prods.map(p=>p.n).join(' y ');
  const verbo = persona.n==='la abuela' ? 'La abuela' : persona.n;
  $('#consigna').innerHTML = `🤔 <b>${verbo}</b> tiene <b>$${tiene}</b> y quiere comprar <b>${que}</b>.`;
  const esc = $('#escena');
  esc.innerHTML = `
    <div class="panel izq">
      <div class="persona"><div class="cara">${persona.e}</div>
        <div><div class="nombre">${verbo.charAt(0).toUpperCase()+verbo.slice(1)}</div><div class="texto-tiene">tiene <b>$${tiene}</b> 👛</div></div></div>
      <div class="productos">${prods.map(htmlProducto).join('<div class="mas">+</div>')}</div>
      <div class="lugar-esq" id="lugarEsqSuma"></div>
      <div class="paso" id="paso1">
        <div class="pregunta"><span class="num-paso">1</span> ¿Le alcanza la plata?
          <button class="btn btn-si" id="btnSi">Sí</button><button class="btn btn-no" id="btnNo">No</button></div>
      </div>
      <div class="mensaje" id="msg"></div>
    </div>
    <div class="panel der paso bloqueado" id="paso2">
      <div class="pregunta"><span class="num-paso">2</span> <span id="preg2">¿Cuánto le sobra?</span>
        <span class="campo">$<input id="inDif" inputmode="numeric" maxlength="4" autocomplete="off"></span></div>
      <div class="lugar-esq" id="lugarEsqResta"></div>
      <div class="pregunta" style="font-size:17px" id="preg2b">Arrastrá el vuelto a la bandeja.</div>
      <div id="lugarZona" style="flex:1;display:flex;min-height:0"></div>
      <div class="acciones-zona" id="accZona"></div>
      <button class="btn btn-verde" id="btnVerificar">✔ Verificar</button>
    </div>`;
  elMensaje = $('#msg');
  $('#lugarZona').appendChild(crearZona('bandeja','Arrastrá acá la plata','🪙'));
  botonVerSuma('bandeja').forEach(x=>$('#accZona').appendChild(x));
  if(dos) $('#lugarEsqSuma').appendChild(botonEsquema('suma','+',prods[0].precio,prods[1].precio,'Sumar los precios (cálculo reflexivo)'));
  const responder = (dijoSi) => {
    if(dijoSi!==alcanza){
      fallo(alcanza ? `Mirá bien: tiene $${tiene} y la compra cuesta menos. ¡Sí le alcanza!` : `Mirá bien: la compra cuesta más de $${tiene}. ¡No le alcanza!`);
      return;
    }
    sBien();
    mensaje(alcanza ? `✅ ¡Sí! La compra cuesta $${total} y tiene $${tiene}.` : `✅ ¡Exacto! La compra cuesta $${total} y solo tiene $${tiene}.`, 'bien');
    $('#btnSi').disabled = $('#btnNo').disabled = true;
    $('#paso2').classList.remove('bloqueado');
    $('#preg2').textContent = alcanza ? '¿Cuánto le sobra?' : '¿Cuánto le falta?';
    $('#preg2b').textContent = alcanza ? 'Arrastrá a la bandeja la plata que le sobra (el vuelto).' : 'Arrastrá a la bandeja la plata que le falta.';
    $('#lugarEsqResta').appendChild(alcanza
      ? botonEsquema('resta','-',tiene,total,`Restar $${tiene} − $${total} (cálculo reflexivo)`)
      : botonEsquema('resta','-',total,tiene,`Restar $${total} − $${tiene} (cálculo reflexivo)`));
    mostrarBanco();
    $('#inDif').focus();
  };
  $('#btnSi').onclick = () => responder(true);
  $('#btnNo').onclick = () => responder(false);
  const inp = $('#inDif');
  inp.addEventListener('input', ()=>{ inp.classList.remove('mal','bien'); limpiarMensaje(); });
  $('#btnVerificar').onclick = () => {
    const v = leer(inp);
    if(v===null){ mensaje('✏️ Escribí cuánto le '+(alcanza?'sobra':'falta')+'.','info'); inp.focus(); return; }
    if(v!==dif){ marcar(inp,false); fallo(alcanza ? `Revisá la resta: $${tiene} − $${total}.` : `Revisá la resta: $${total} − $${tiene}.`); return; }
    marcar(inp,true);
    const s = sumaZona('bandeja');
    if(s===0){ mensaje('👍 ¡Bien calculado! Ahora arrastrá esa plata a la bandeja.','info'); return; }
    if(s!==dif){ zonas.bandeja.el.classList.add('mal'); fallo(`En la bandeja hay $${s} y tiene que haber $${dif}.`); return; }
    zonas.bandeja.el.classList.add('bien');
    mensaje(alcanza ? `🎉 ¡Muy bien! Le sobran $${dif}.` : `🎉 ¡Muy bien! Le faltan $${dif}.`, 'bien');
    setTimeout(rondaGanada, 600);
  };
}

/* ================= ACTIVIDAD 3: CONTAR Y COMPLETAR ================= */
function armarBilletera(){
  for(let intento=0; intento<200; intento++){
    const c = {b500:R(0,1), b200:R(0,1), b100:R(0,2), b50:R(0,1), b20:R(0,2), b10:R(0,2), m10:R(0,2), m5:R(0,1), m1:R(0,4)};
    const items = []; for(const k in c) for(let i=0;i<c[k];i++) items.push(k);
    const total = items.reduce((s,id)=>s+D[id].v,0);
    if(items.length>=5 && items.length<=13 && total>=150 && total<=999) return {items, total};
  }
  return {items:['b100','b50','b20','m10','m5','m1'], total:186};
}
function ronda3(){
  const persona = azar(PERSONAS.filter(p=>p.n!=='la abuela'));
  const bill = armarBilletera();
  const W = bill.total;
  const T = R(Math.max(40, Math.floor(W*.45)), W-R(3,40));
  const p1 = R(Math.max(10, Math.floor(T*.3)), Math.max(11, T-10));
  const p2 = T - p1;
  const sobra = W - T;
  datos = {W, T, sobra};
  $('#consigna').innerHTML = `✏️ <b>Contá</b> la plata que tiene <b>${persona.n}</b>, mirá el ticket y <b>completá</b> las oraciones.`;
  const esc = $('#escena');
  esc.innerHTML = `
    <div class="panel izq">
      <div class="persona"><div class="cara">${persona.e}</div><div class="nombre">${persona.n.toUpperCase()}</div></div>
      <div class="billetera" id="billetera"></div>
      <div class="ticket">
        <div class="tit">🧾 TICKET DE COMPRA</div>
        <div class="suma">$${p1}<br><span style="float:left">+</span>$${p2}</div>
        <div class="raya"></div>
        <div class="lin"><span style="font-family:Fredoka;font-size:16px">TOTAL</span><span>$ ?</span></div>
      </div>
      <div class="lugar-esq" id="lugarEsqSuma" style="justify-content:center"></div>
    </div>
    <div class="panel der">
      <div class="frases">
        <div class="frase"><span>Cantidad de dinero que tiene <b>${persona.n.toUpperCase()}</b>:</span> <span class="campo">$<input id="in1" inputmode="numeric" maxlength="4" autocomplete="off"></span></div>
        <div class="frase"><span>Total de dinero que necesita para pagar la compra:</span> <span class="campo">$<input id="in2" inputmode="numeric" maxlength="4" autocomplete="off"></span></div>
        <div class="frase"><span>Total de dinero que le sobra:</span> <span class="campo">$<input id="in3" inputmode="numeric" maxlength="4" autocomplete="off"></span></div>
      </div>
      <div class="lugar-esq" id="lugarEsqResta"></div>
      <div class="mensaje" id="msg" style="margin-top:auto"></div>
      <button class="btn btn-verde" id="btnVerificar">✔ Verificar</button>
    </div>`;
  elMensaje = $('#msg');
  $('#lugarEsqSuma').appendChild(botonEsquema('suma','+',p1,p2,'Sumar el ticket (cálculo reflexivo)'));
  $('#lugarEsqResta').appendChild(botonEsquema('resta','-',W,T,'¿Cuánto sobra? (cálculo reflexivo)', true));
  const bw = $('#billetera');
  // ordenar de mayor a menor como en la hoja, pero con monedas al final
  bill.items.sort((a,b)=> (D[a].tipo===D[b].tipo ? D[b].v-D[a].v : (D[a].tipo==='billete'?-1:1)))
    .forEach(id => bw.appendChild(elDinero(id, true)));
  const ins = ['#in1','#in2','#in3'].map(s=>$(s));
  ins.forEach((inp,i)=>{
    inp.addEventListener('input', ()=>{ inp.classList.remove('mal','bien'); limpiarMensaje(); });
    inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ if(i<2) ins[i+1].focus(); else $('#btnVerificar').click(); } });
  });
  $('#btnVerificar').onclick = () => {
    const vals = ins.map(leer);
    if(vals.some(v=>v===null)){ mensaje('✏️ Completá las tres oraciones.','info'); return; }
    const ok = [vals[0]===W, vals[1]===T, vals[2]===sobra];
    ok.forEach((o,i)=>marcar(ins[i],o));
    if(ok.every(Boolean)){ mensaje(`🎉 ¡Perfecto! Tiene $${W}, gasta $${T} y le sobran $${sobra}.`,'bien'); setTimeout(rondaGanada,600); return; }
    const pistas = [];
    if(!ok[0]) pistas.push('Contá de nuevo la plata: empezá por los billetes más grandes.');
    if(!ok[1]) pistas.push('Sumá los dos precios del ticket.');
    if(!ok[2]) pistas.push('Para saber cuánto sobra, restá: lo que tiene − lo que gasta.');
    fallo(pistas.join(' '));
  };
}

/* ================= CÁLCULO REFLEXIVO (esquema en árbol, como la hoja) =================
   Espacio virtual de 960 de ancho. Flechas: verde = cienes, azul = dieces, rojo = unos.
   Si la cuenta necesita canje, se agregan niveles extra (como el ejercicio b del PDF). */
let esquemas = {};
const partes = n => [Math.floor(n/100)*100, Math.floor(n%100/10)*10, n%10];
const ANCHO_E = 960, PASO_Y = 108, BOX_W = 86, BOX_H = 50;

function nuevoLayout(){
  const L = {nodos:[], lineas:[], ops:[], etiquetas:[], maxY:0};
  L.box = (x, y, v, color, tipo='input') => {
    const n = {x, y, v, color, tipo, w: tipo==='total'?112:(tipo==='fija'||color==='n'?104:BOX_W), h: tipo==='total'?58:BOX_H};
    L.nodos.push(n); L.maxY = Math.max(L.maxY, y); return n;
  };
  L.linea = (de, a, color, viaY=null) => L.lineas.push({de, a, color, viaY});
  L.op = (s, x, y) => L.ops.push({s, x, y});
  L.etiqueta = (txt, y) => L.etiquetas.push({txt, y});
  return L;
}

function layoutSuma(A, B, abierto){
  const L = nuevoLayout(); const t = abierto ? 'input' : 'fija';
  const [cA,dA,uA] = partes(A), [cB,dB,uB] = partes(B);
  let y = 40;
  const a = L.box(270, y, A, 'n', t), b = L.box(630, y, B, 'n', t); L.op('+', 450, y);
  y += PASO_Y;
  const r1 = [L.box(160,y,cA,'c'), L.box(270,y,dA,'d'), L.box(380,y,uA,'u'), L.box(520,y,cB,'c'), L.box(630,y,dB,'d'), L.box(740,y,uB,'u')];
  [215,325,575,685].forEach(x => L.op('+', x, y));
  ['c','d','u'].forEach((c,i) => { L.linea(a, r1[i], c); L.linea(b, r1[i+3], c); });
  y += PASO_Y;
  const r2 = [L.box(125,y,cA,'c'), L.box(235,y,cB,'c'), L.box(395,y,dA,'d'), L.box(505,y,dB,'d'), L.box(665,y,uA,'u'), L.box(775,y,uB,'u')];
  [180,450,720].forEach(x => L.op('+', x, y));
  L.linea(r1[0],r2[0],'c'); L.linea(r1[3],r2[1],'c'); L.linea(r1[1],r2[2],'d'); L.linea(r1[4],r2[3],'d'); L.linea(r1[2],r2[4],'u'); L.linea(r1[5],r2[5],'u');
  y += PASO_Y;
  let C = cA+cB, D = dA+dB, U = uA+uB;
  let nc = L.box(180,y,C,'c'), nd = L.box(450,y,D,'d'), nu = L.box(720,y,U,'u');
  L.op('+',315,y); L.op('+',585,y);
  L.linea(r2[0],nc,'c'); L.linea(r2[1],nc,'c'); L.linea(r2[2],nd,'d'); L.linea(r2[3],nd,'d'); L.linea(r2[4],nu,'u'); L.linea(r2[5],nu,'u');
  // Como mucho 6 niveles: si hay canje, un solo nivel separa lo que sobra
  // (10 unos → 1 diez, 10 dieces → 1 cien) y el último nivel junta todo.
  if(U >= 10 || D >= 100){
    y += PASO_Y;
    const txt = [];
    const total = A + B, [cf, df, uf] = partes(total);
    const s = {};
    s.c = L.box(D>=100 ? 140 : 180, y, C, 'c'); 
    if(D >= 100){ s.cien = L.box(270, y, 100, 'c'); s.d = L.box(400, y, D-100, 'd'); txt.push('10 dieces = 1 cien'); }
    else s.d = L.box(450, y, D, 'd');
    if(U >= 10){ s.diez = L.box(580, y, 10, 'd'); s.u = L.box(720, y, U-10, 'u'); txt.push('10 unos = 1 diez'); }
    else s.u = L.box(720, y, U, 'u');
    const fila = [s.c, s.cien, s.d, s.diez, s.u].filter(Boolean);
    for(let i=0;i<fila.length-1;i++) L.op('+', (fila[i].x+fila[i+1].x)/2, y);
    L.etiqueta('¡Canje! ' + txt.join(' y '), y);
    L.linea(nc, s.c, 'c');
    if(s.cien){ L.linea(nd, s.cien, 'c'); L.linea(nd, s.d, 'd'); } else L.linea(nd, s.d, 'd');
    if(s.diez){ L.linea(nu, s.diez, 'd'); L.linea(nu, s.u, 'u'); } else L.linea(nu, s.u, 'u');
    y += PASO_Y;
    nc = L.box(180, y, cf, 'c'); nd = L.box(450, y, df, 'd'); nu = L.box(720, y, uf, 'u');
    L.op('+',315,y); L.op('+',585,y);
    // a dónde va cada parte: si los dieces llegan a 100, forman un cien
    const dRest = s.cien ? D-100 : D;
    const dieceVaACien = !s.cien && s.diez && dRest + 10 >= 100;
    L.linea(s.c, nc, 'c');
    if(s.cien) L.linea(s.cien, nc, 'c');
    L.linea(s.d, dieceVaACien ? nc : nd, 'd');
    if(s.diez) L.linea(s.diez, dieceVaACien ? nc : nd, 'd');
    L.linea(s.u, nu, 'u');
  }
  L.op('=', 812, y); L.box(882, y, A+B, 'n', 'total');
  return L;
}

function layoutResta(A, B, abierto){
  const L = nuevoLayout(); const t = abierto ? 'input' : 'fija';
  let [c,d,u] = partes(A); const [cB,dB,uB] = partes(B);
  let y = 40;
  const a = L.box(270, y, A, 'n', t), b = L.box(630, y, B, 'n', t); L.op('−', 450, y);
  y += PASO_Y;
  const r1 = [L.box(160,y,c,'c'), L.box(270,y,d,'d'), L.box(380,y,u,'u'), L.box(520,y,cB,'c'), L.box(630,y,dB,'d'), L.box(740,y,uB,'u')];
  [215,325,575,685].forEach(x => L.op('+', x, y));
  ['c','d','u'].forEach((col,i) => { L.linea(a, r1[i], col); L.linea(b, r1[i+3], col); });
  let izq = r1.slice(0,3);
  const canjeCien = () => {
    y += PASO_Y; L.etiqueta('¡Canje! 1 de $100 = 10 de $10', y);
    c -= 100; d += 100;
    const n = [L.box(160,y,c,'c'), L.box(270,y,d,'d'), L.box(380,y,u,'u')];
    L.op('+',215,y); L.op('+',325,y);
    L.linea(izq[0],n[0],'c'); L.linea(izq[0],n[1],'c'); L.linea(izq[1],n[1],'d'); L.linea(izq[2],n[2],'u');
    izq = n;
  };
  const canjeDiez = () => {
    y += PASO_Y; L.etiqueta('¡Canje! 1 de $10 = 10 de $1', y);
    d -= 10; u += 10;
    const n = [L.box(160,y,c,'c'), L.box(270,y,d,'d'), L.box(380,y,u,'u')];
    L.op('+',215,y); L.op('+',325,y);
    L.linea(izq[0],n[0],'c'); L.linea(izq[1],n[1],'d'); L.linea(izq[1],n[2],'d'); L.linea(izq[2],n[2],'u');
    izq = n;
  };
  if(u < uB){ if(d === 0) canjeCien(); canjeDiez(); }
  if(d < dB) canjeCien();
  y += PASO_Y;
  const r2 = [L.box(125,y,c,'c'), L.box(235,y,cB,'c'), L.box(395,y,d,'d'), L.box(505,y,dB,'d'), L.box(665,y,u,'u'), L.box(775,y,uB,'u')];
  [180,450,720].forEach(x => L.op('−', x, y));
  // si hubo canje, las flechas del número que se resta bajan derecho y doblan al final (no cruzan los casilleros)
  const conCanje = izq[0] !== r1[0];
  const vY = conCanje ? y - 52 : null;
  L.linea(izq[0],r2[0],'c'); L.linea(r1[3],r2[1],'c',vY); L.linea(izq[1],r2[2],'d'); L.linea(r1[4],r2[3],'d',vY); L.linea(izq[2],r2[4],'u'); L.linea(r1[5],r2[5],'u',vY);
  y += PASO_Y;
  const f = [L.box(180,y,c-cB,'c'), L.box(450,y,d-dB,'d'), L.box(720,y,u-uB,'u')];
  L.op('+',315,y); L.op('+',585,y);
  L.linea(r2[0],f[0],'c'); L.linea(r2[1],f[0],'c'); L.linea(r2[2],f[1],'d'); L.linea(r2[3],f[1],'d'); L.linea(r2[4],f[2],'u'); L.linea(r2[5],f[2],'u');
  L.op('=', 812, y); L.box(882, y, A-B, 'n', 'total');
  return L;
}

function botonEsquema(clave, signo, A, B, texto, abierto=false){
  const b = document.createElement('button');
  b.className = 'btn btn-esquema'; b.type = 'button';
  b.innerHTML = '🧮 ' + (texto || 'Cálculo reflexivo');
  b.onclick = () => abrirEsquema(clave, signo, A, B, abierto);
  return b;
}

function svgLineas(L, H){
  const COL = {c:'#2e9e44', d:'#2f5bd8', u:'#d93a3a'};
  const marcas = Object.entries(COL).map(([k,v]) =>
    `<marker id="fl-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${v}"/></marker>`).join('');
  const lineas = L.lineas.map(({de,a,color,viaY}) => {
    const x1 = de.x, y1 = de.y + de.h/2, x2 = a.x, y2 = a.y - a.h/2 - 3;
    const pts = viaY ? `${x1},${y1} ${x1},${viaY} ${x2},${y2}` : `${x1},${y1} ${x2},${y2}`;
    return `<polyline points="${pts}" fill="none" stroke="${COL[color]}" stroke-width="2.6" stroke-linejoin="round" marker-end="url(#fl-${color})"/>`;
  }).join('');
  return `<svg class="esq-svg" viewBox="0 0 ${ANCHO_E} ${H}"><defs>${marcas}</defs>${lineas}</svg>`;
}

function abrirEsquema(clave, signo, A, B, abierto=false){
  if(!esquemas[clave]) esquemas[clave] = {valores:{}, hecho:false};
  const est = esquemas[clave];
  const L = signo==='+' ? layoutSuma(A,B,abierto) : layoutResta(A,B,abierto);
  const H = L.maxY + 45;
  const px = (v, tot) => (v/tot*100) + '%';
  let n = 0;
  const cajas = L.nodos.map(nd => {
    const pos = `left:${px(nd.x-nd.w/2,ANCHO_E)};top:${px(nd.y-nd.h/2,H)};width:${px(nd.w,ANCHO_E)};height:${px(nd.h,H)}`;
    if(nd.tipo==='fija') return `<div class="esq-caja fija" style="${pos}">${nd.v}</div>`;
    const id = n++; const prev = est.valores[id] ?? '';
    return `<input class="esq-caja c-${nd.color} ${nd.tipo==='total'?'total':''}" style="${pos}" data-id="${id}" value="${prev}" ${nd.tipo==='total'?'placeholder="?"':''} inputmode="numeric" maxlength="4" autocomplete="off">`;
  }).join('');
  const ops = L.ops.map(o => `<div class="esq-op" style="left:${px(o.x-16,ANCHO_E)};top:${px(o.y-18,H)};width:${px(32,ANCHO_E)};height:${px(36,H)}">${o.s}</div>`).join('');
  const etqs = L.etiquetas.map(e => `<div class="esq-etq" style="left:${px(800,ANCHO_E)};top:${px(e.y-16,H)};width:${px(155,ANCHO_E)}">${e.txt}</div>`).join('');
  $('#capaEsquema').innerHTML = `
    <div class="overlay"><div class="modal modal-esquema">
      <button class="eq-cerrar" id="eqCerrar" title="Cerrar">✖</button>
      <h2>🧮 Cálculo reflexivo: ${signo==='+'?'suma':'resta'}</h2>
      <div class="eq-ref"><span class="c-c">cienes</span><span class="c-d">dieces</span><span class="c-u">unos</span>
        ${abierto ? '<span class="eq-ayuda">Arriba escribí: lo que tiene − lo que gasta</span>' : ''}</div>
      <div class="esq-marco">
        <div class="esq-diagrama" style="aspect-ratio:${ANCHO_E}/${H};width:min(100%, calc((94vh - 210px) * ${(ANCHO_E/H).toFixed(4)}))">
          ${svgLineas(L, H)}${ops}${etqs}${cajas}
        </div>
      </div>
      <div class="eq-nota">✏️ Usá el esquema para pensar la cuenta. Después escribí el resultado en la respuesta.</div>
      <div class="eq-botones">
        <button class="btn btn-gris" id="eqBorrar">🧽 Borrar</button>
        <button class="btn btn-verde" id="eqListo">✔ Listo</button>
      </div>
    </div></div>`;
  // orden de tabulación: de arriba hacia abajo y de izquierda a derecha
  const ins = [...document.querySelectorAll('#capaEsquema input.esq-caja')]
    .sort((p,q) => parseFloat(p.style.top)-parseFloat(q.style.top) || parseFloat(p.style.left)-parseFloat(q.style.left));
  ins.forEach((inp,i) => {
    inp.addEventListener('input', () => { est.valores[inp.dataset.id] = inp.value; inp.classList.remove('bien','mal'); });
    inp.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); (ins[i+1] || $('#eqListo')).focus(); } });
  });
  const primero = ins.find(x => x.value===''); if(primero) setTimeout(()=>primero.focus(), 50);
  $('#eqCerrar').onclick = cerrarEsquema;
  $('#eqBorrar').onclick = () => { est.valores = {}; ins.forEach(x => { x.value=''; x.classList.remove('bien','mal'); }); ins[0] && ins[0].focus(); };
  $('#eqListo').onclick = cerrarEsquema;
}
function cerrarEsquema(){ $('#capaEsquema').innerHTML=''; }
document.addEventListener('keydown', e => { if(e.key==='Escape' && $('#capaEsquema').innerHTML) cerrarEsquema(); });

pintarInicio();
