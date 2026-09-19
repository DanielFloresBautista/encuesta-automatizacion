const form = document.getElementById("encuestaForm");
const questions = [...document.querySelectorAll(".question")];
let current = 0;

function updateUI(){
  questions.forEach((q,i)=>q.classList.toggle("active",i===current));
  const pct=Math.round(((current+1)/questions.length)*100);
  document.getElementById("progresoTexto").textContent=`Pregunta ${current+1} de ${questions.length}`;
  document.getElementById("progresoPct").textContent=`${pct}%`;
  document.getElementById("barraProgreso").style.width=pct+"%";
  document.getElementById("btnAnterior").disabled=current===0;
  document.getElementById("btnAnterior").style.opacity=current===0?".5":"1";
  document.getElementById("btnSiguiente").style.display=current===questions.length-1?"none":"inline-block";
  document.getElementById("btnGuardar").style.display=current===questions.length-1?"inline-block":"none";
  window.scrollTo({top:0,behavior:"smooth"});
}
document.getElementById("btnSiguiente").onclick=()=>{if(current<questions.length-1){current++;updateUI()}};
document.getElementById("btnAnterior").onclick=()=>{if(current>0){current--;updateUI()}};

function values(name){
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(x=>x.value);
}
function val(name){const x=form.elements[name]; return x ? x.value.trim() : ""}

function buildData(){
  const data={fecha:new Date().toLocaleString("es-MX"), negocio:val("negocio"), contacto:val("contacto"), telefono:val("telefono"),
    actividad:values("actividad").join(", ") + (val("actividadOtro")?`, ${val("actividadOtro")}`:""),
    personasAdmin:val("personasAdmin"), herramientas:values("herramientas").join(", ") + (val("herramientasOtro")?`, ${val("herramientasOtro")}`:""),
    copiaInfo:val("copiaInfo"), copiaInfoDetalle:val("copiaInfoDetalle"), actividadTiempo:val("actividadTiempo"),
    tareasRepetitivas:val("tareasRepetitivas"), manual:val("manual"), manualDetalle:val("manualDetalle"),
    documentos:val("documentos"), tipoDocumento:values("tipoDocumento").join(", "), erroresProceso:val("erroresProceso"),
    correccionErrores:val("correccionErrores"), perdidaInfo:val("perdidaInfo"), frecuencia:val("frecuencia"),
    frecuenciaPeriodo:val("frecuenciaPeriodo"), minutosOperacion:val("minutosOperacion"), unidadTiempo:val("unidadTiempo"),
    personasProceso:val("personasProceso"), tareaEliminar:val("tareaEliminar"), sistemaActividad:val("sistemaActividad"),
    sistemaNombre:val("sistemaNombre"), limitacionSistema:val("limitacionSistema"), limitacionDetalle:val("limitacionDetalle"),
    automatizar:values("automatizar").join(", "), ahorroTiempo:val("ahorroTiempo"), notas:val("notas")};
  return data;
}

function guardar(data){
  const registros=JSON.parse(localStorage.getItem("encuestasAutomatizacion")||"[]");
  registros.push({...data,id:Date.now()});
  localStorage.setItem("encuestasAutomatizacion",JSON.stringify(registros));
  actualizarContador();
}

form.addEventListener("submit",e=>{
  e.preventDefault();
  guardar(buildData());
  alert("Encuesta guardada correctamente en este dispositivo.");
  form.reset(); current=0; updateUI(); mostrarRegistros();
});

function registros(){
  return JSON.parse(localStorage.getItem("encuestasAutomatizacion")||"[]");
}
function actualizarContador(){document.getElementById("contador").textContent=registros().length}
function mostrarRegistros(){
  const panel=document.getElementById("registrosPanel"), lista=document.getElementById("listaRegistros");
  panel.classList.remove("hidden"); const rs=registros();
  if(!rs.length){lista.innerHTML='<div class="empty">No hay encuestas guardadas.</div>';return}
  lista.innerHTML=rs.slice().reverse().map((r,i)=>`<div class="registro">
    <strong>${escapeHTML(r.negocio||"Negocio sin nombre")}</strong>
    <small>${escapeHTML(r.fecha)} ${r.contacto?"· "+escapeHTML(r.contacto):""}</small>
    <div><b>Actividad principal:</b> ${escapeHTML(r.actividad||"No indicada")}</div>
    <div><b>Tarea que eliminaría:</b> ${escapeHTML(r.tareaEliminar||"No indicada")}</div>
    <button class="btn danger" onclick="eliminar(${r.id})">Eliminar</button>
  </div>`).join("");
}
function eliminar(id){
  const rs=registros().filter(r=>r.id!==id); localStorage.setItem("encuestasAutomatizacion",JSON.stringify(rs)); actualizarContador(); mostrarRegistros();
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`}
// 1. Exportación corregida para Excel en español (delimitador ;)
function exportarCSV() {
  const rs = registros();
  if (!rs.length) {
    alert("No hay registros para exportar.");
    return;
  }
  const keys = Object.keys(rs[0]);
  
  // Uso de punto y coma (;) para compatibilidad nativa con Excel LATAM
  const csv = [
    keys.map(k => `"${String(k).replace(/"/g, '""')}"`).join(";"),
    ...rs.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(";"))
  ].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `encuestas_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// 2. Control de visibilidad (Toggle) del panel de registros
function toggleRegistros() {
  const panel = document.getElementById("registrosPanel");
  if (panel.classList.contains("hidden")) {
    mostrarRegistros();
  } else {
    panel.classList.add("hidden");
  }
}

// 3. Validación mínima antes de guardar
form.addEventListener("submit", e => {
  e.preventDefault();
  const data = buildData();
  
  if (!data.negocio && !data.contacto && !data.tareaEliminar) {
    alert("Ingresa al menos el nombre del negocio o la tarea a eliminar antes de guardar.");
    return;
  }

  guardar(data);
  alert("Encuesta guardada correctamente.");
  form.reset();
  current = 0;
  updateUI();
  document.getElementById("registrosPanel").classList.add("hidden");
});

// Asignación de evento al botón de registros
document.getElementById("btnVerRegistros").onclick = toggleRegistros;
document.getElementById("btnExportar").onclick=exportarCSV;
document.getElementById("btnVerRegistros").onclick=mostrarRegistros;
document.getElementById("btnBorrarTodo").onclick=()=>{if(confirm("¿Borrar todas las encuestas de este dispositivo?")){localStorage.removeItem("encuestasAutomatizacion");actualizarContador();mostrarRegistros()}};
actualizarContador();updateUI();