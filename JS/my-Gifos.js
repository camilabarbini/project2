/********************************************VARIABLES*****************************************/
const stylesId = document.getElementById("styles");
let clock;
let duration;
let interval;
let msInterval;
let stream;
let video;
let recorder;
let blob;
const recorderGifId=document.getElementById("recordedGif");
const recordingBox=document.getElementById("recordingBox");
const canvasDiv=document.getElementById("canvasDiv");
let form = new FormData();
let context;
const canvas=document.getElementById("canvas");
const canvasUploaded=document.getElementById("canvasUploaded");
const uploadingGuifo=document.getElementById("uploadingGuifo");
const uploadGuifoId=document.getElementById("uploadGuifo");
const description=document.querySelector(".description");
const myGuifosBox= document.getElementById("myGuifosBox");
let parts;
let partsUploading;
let animation;
let l=0;
let title, value;
let myGifsArray;
var gifsInLocal;
var cancel;
var gifURL;

/***********************A TENER EN CUENTA PARA CARGAR LA PAGINA**************************/
getGifsLocalStorage();
function toggle(initialStatus, finalStatus){
  initialStatus.classList.toggle(finalStatus);
}
myGifsArray?SwhowMyGifos():false
function SwhowMyGifos(){
  myGifsArray.forEach(element=>{
  myGuifosBox.innerHTML+="<div class='gifos'><img src='https://media.giphy.com/media/"+element+"/giphy.gif'></div>"}) 
  gifos = Array.from(myGuifosBox.getElementsByClassName("gifos"));
  for(i=0; i<=gifos.length-2; i=i+3){
    toggle(gifos[i], "gifos2");}
}

/**************************************CRONOMETRO***************************************/

function startChronometer(){
  var s = 0;
  var ms = 0;
  var sAux="00";
  var msAux="00";

  interval=setInterval(seconds, 1000);
  msInterval=setInterval(miliseconds, 0.5);

  function miliseconds(){
    if(ms<99){
      ms=ms+1;
      if(ms<10){msAux="0"+ms}
      else{msAux=ms} 
    }
    else{ms=0;msAux="00"}
    clock="00:00:" + sAux + ":" + msAux;
    document.getElementById("clock").innerHTML = clock; 
  }
  function seconds(){
    s++;
    if(s==1){window.sessionStorage.setItem("oneSecond", "true")};
    if (s<10){sAux="0"+s;}else{sAux=s;}
    duration=((sAux*1000)+(msAux*10))
    if(sAux==15){
      clock="00:00:15:00";
      document.getElementById("clock").innerHTML = clock; 
      window.clearInterval(interval);
      window.clearInterval(msInterval);
      finishRecorder();
    }
  }
  
}
function stopChronometer(){
  sAux="00";
  msAux="00";
  window.clearInterval(interval);
  window.clearInterval(msInterval);
  window.sessionStorage.removeItem("oneSecond");
}
/************************************SI ENTRO DESDE MIS GIFOS SOLO MUESTRA ESA SEC*************************/

window.sessionStorage.getItem("myGifosDirect")?document.getElementById("newGifoSec").style="display:none":document.getElementById("newGifoSec").style="display:block";

/************************************VOLVER ATRAS O CARGAR HOME*****************************************/

document.getElementById("cancelGetMedia").addEventListener("click",()=>location.assign("./index.html"));

document.getElementById("backHome").addEventListener("click",()=>{
  location.assign("./index.html")
  window.sessionStorage.removeItem("myGifosDirect")
});


/************************************CARGAR CON EL THEME ELEGIDO*******************************/

window.localStorage.getItem("nightTheme")?loadNight():loadDay();
function loadNight(){
    stylesId.href="./STYLES/night-style.css";
    document.querySelector(".logo").src="./assets/gifOF_logo_dark.png"
    document.querySelector("#camera").src="./assets/camera_light.svg"
  }
function loadDay(){
    stylesId.href="./STYLES/day-style.css";
    document.querySelector(".logo").src="./assets/gifOF_logo.png"
    document.querySelector("#camera").src="./assets/camera.svg"
  }
  
/*****************************************INSTRUCCIONES PARA VIDEO*************************************/
document.getElementById("startGetMedia").addEventListener("click",startGetMedia)//INICIO LA CAMARA
document.getElementById("captureAgain").addEventListener("click",()=>location.reload())

function startGetMedia(){
    document.querySelector("#newGifo").style="display:none";
    document.querySelector("#captureBox").style="display:block";
    document.querySelector("#closeCapture").addEventListener("click", ()=>location.reload());
    if(recorder){recorder.destroy();recorder = null;};
    getMedia();
}
/*****************************************OBTENER STREAM PARA VIDEO*************************************/

async function getMedia () {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
    height: { max: 480 }
    }
  })
  .then(stream=>{
    video = document.getElementById("streamingVideo");
    video.srcObject = stream;
    video.play();
    return stream;
  })
  .catch(()=>{
    console.log(console.error);
    alert("Ocurrio un error al cargar tu gif, vuelve a intentaro");
    cancelUploading();
  })
  function getRecorder(stream) {
    return RecordRTC(stream, {
        type: "gif",
        frameRate: 1, 
        quality: 10,
        width: 360,
        hidden: 240,
        timeSlice: 1000,
    });
  }
  recorder = getRecorder(stream);
  document.getElementById("captureButton").addEventListener("click",()=>{//EVENT LISTENER SI EMPIEZA A GRABAR
    document.getElementById("captureButton").style="display:none";
    recordingBox.style="display:flex";
    captureMedia()});
}
/*****************************************GRABANDO VIDEO*************************************/
async function captureMedia(){
  startChronometer();
  description.innerHTML="Capturando Tu Guifo"
  await recorder.startRecording();
 } 
/*****************************************FINALIZAR GRABACION*************************************/
document.querySelector("#finishRecorder").addEventListener("click",()=>{
  if(window.sessionStorage.getItem("oneSecond")){
    finishRecorder();
    window.sessionStorage.removeItem("oneSecond");
  }
  else{
    stopChronometer();
    alert("El video debe durar, al menos, 1 segundo.");
    location.reload();
  }
} );
function finishRecorder(){
    stopChronometer();
    description.innerHTML="Vista Previa";
    document.getElementById("recordingButton").style="display:none";
    document.getElementById("recordedBox").style="display:flex";
    recorder.stopRecording(()=>{
        blob = recorder.getBlob();
        recorderGifId.src = recorder.toURL();
        document.getElementById("streamingVideoDiv").style="display:none";
        takeAPicture();//PARA MOSTRAR IMAGEN CONGELADA     
    //FINALIZO LA CAMARA
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    });
    };

/****************TOMAR FOTO PARA VISTA PREVIA*********************/
function takeAPicture(){
  context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.src = canvas.toDataURL();
  context = canvasUploaded.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvasUploaded.src = canvasUploaded.toDataURL();
  canvasDiv.style="display:block"
}

/**************************************REPRODUCIR GIF Y LINEA ANIMADA***************************************/
function showGif(){
  canvasDiv.style="display:none";
  document.getElementById("recordedGifDiv").style="display:block";
}

document.querySelector(".playDiv").addEventListener("click", ()=>{
  l=0;
  parts=Array.from(document.getElementsByClassName("lineParts"));
  uploadGuifoId.removeEventListener("click", uploadGuifo);
  if(duration>4000){
    animation=setInterval(animateLine,((duration*0.1)));
  }
  else{
    animation=setInterval(animateLine,200);
  }
  showGif();
});

function animateLine(){
  if(l<parts.length){
    parts[l].className+=" paintedLine";
    l++;
  }
  else{
    window.clearInterval(animation);
    canvasDiv.style="display:block";
    document.getElementById("recordedGifDiv").style="display:none";
    uploadGuifoId.addEventListener("click", uploadGuifo);
    parts.forEach(element=>element.className="lineParts");  
  }
}
function animateLineUploading(){
  if(l<partsUploading.length){
    partsUploading[l].className+=" paintedLineUploading";
    l++;
  }
  else{
    uploaded();
  }
}
/************************ POST GUIFOS ****************************/
uploadGuifoId.addEventListener("click", uploadGuifo)

async function uploadGuifo(){
  cancel=false;
  //MUESTRO-ESCONDO ELEMENTOS
  description.innerHTML="Subiendo Guifo";
  recordingBox.style="display:none";
  canvasDiv.style="display:none";
  uploadingGuifo.style="display:block";
  //BARRA DE CARGA ANIMADA
  l=0;
  partsUploading=Array.from(document.getElementsByClassName("linePartsUploading"));
  animation=setInterval(animateLineUploading, 200);
  
  //FUNCIONALIDAD BOTON CANCELAR
  document.getElementById("cancelUploading").addEventListener("click", cancelUploading);
  var parameters = {
    method: 'POST',
    body: form,
    type: 'no-cors',
  };
  form.append('file', blob, 'myGif.gif');
  if(!cancel){
    let uploadedToGiphy= await fetch('https://upload.giphy.com/v1/gifs?api_key=zChu4jZUnEY5xoWO0O5zLk07L02yrkMS', parameters)
    .then(response=>response.json())
    .then(data=>data)
    .catch(()=>{console.error;
      alert("falta movimiento! Por favor repite la captura");
      cancelUploading();
    })
    document.getElementById("cancelUploading").style="display:none";
  //MANEJO DE LA RESPUESTA
    value=uploadedToGiphy.data.id;
    gifURL="https://media.giphy.com/media/"+value+"/giphy.gif";
    document.getElementById("downloadGif").addEventListener("click",()=>downloadMyGif(gifURL));
    document.getElementById("copyGifUrl").addEventListener("click",()=>copyURL(gifURL));
    document.getElementById("close").addEventListener("click",()=>location.assign("./index.html"));
    myGifsArray.push(value);
  //guardo en localstorage
    setGifsLocalStorage(myGifsArray);
  }
}
/******************************CANCELO SUBIDA DE GIF*******************************/
function cancelUploading(){
  cancel=true;
  description.innerHTML="Vista Previa";
  recordingBox.style="display:flex";
  canvasDiv.style="display:block";
  uploadingGuifo.style="display:none";
  window.clearInterval(animation);
  partsUploading?partsUploading.forEach(element=>element.className="linePartsUploading"):false;
}
/**MUESTRO Y ESCONDO ELEMENTOS UNA VEZ SUBIDO */
function uploaded(){
  window.clearInterval(animation);
  document.getElementById("captureBox").style="display:none";
  uploadingGuifo.style="display:none";
  document.getElementById("uploadedBox").style="display:block"
}
/******************************LOCAL STORAGE*******************************/
function setGifsLocalStorage(myGifsArray){
  localStorage.setItem("myGifsArrayLocal", JSON.stringify(myGifsArray));
}
function getGifsLocalStorage(){
  if(!window.localStorage.getItem("myGifsArrayLocal")){
    myGifsArray=[];
  }
  else{
    gifsInLocal = window.localStorage.getItem('myGifsArrayLocal');
    myGifsArray = JSON.parse(gifsInLocal);
  }
}
///************************BOTON LISTO*************************/
document.getElementById("doneButton").addEventListener("click",()=>{
  recorder.destroy();recorder = null;
  location.assign("./index.html")
});

/******************************COPIAR URL Y DESCARGAR*******************************/
function copyURL(gifURL){
  var aux = document.createElement("input");
  aux.setAttribute("value", gifURL);
  document.body.appendChild(aux);
  aux.select("value");
  document.execCommand("copy");
  document.body.removeChild(aux);
  alert("URL copiada al portapapeles");
}
function downloadMyGif(gifURL){
  fetch(gifURL)
  .then(response=>response.blob())
  .then(data=>{
    var a = document.createElement("a");
          a.href = URL.createObjectURL(data);
          a.setAttribute("download", "myGifo");
          a.click();
  })
} 
function download(url, filename) {
  fetch(url).then(function(t) {
      return t.blob().then((b)=>{
          var a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.setAttribute("download", filename);
          a.click();
      }
      );
  });
  }





