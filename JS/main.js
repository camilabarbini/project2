/********************************************VARIABLES*****************************************/
let apiKey = "zChu4jZUnEY5xoWO0O5zLk07L02yrkMS";

let dropdownBtn = document.querySelector(".dropdownBtn");
let theme = document.getElementById("ulTheme");
let dayTheme = document.getElementById("dayTheme");
let nightTheme = document.getElementById("nightTheme");
let stylesId = document.getElementById("styles");

let trending = document.getElementById("trending");
let suggesting = document.getElementById("suggesting");

let search;
let searching;
var autocomplete;
let resultsId = document.querySelector(".results");
let gifos;

let toTheTop = document.getElementById("toTheTop");

let searchTagsArray;
/********************************************CÓDIGO*****************************************/
window.localStorage.getItem("nightTheme")?toNight():toDay();

/*VOLVER AL INICIO O RECARGAR PAGINA*/
document.querySelector(".logo").addEventListener("click", ()=> {location.reload()})
toTheTop.addEventListener("click", ()=> {window.scrollTo( 0, 0 ), 300;});
document.addEventListener("scroll",()=>{
  if(window.scrollY>250){
    document.querySelector(".navBar").style="position:fixed; top:0";
    if(window.scrollY>300){
      toTheTop.style="display:block";
    }
    else{
      toTheTop.style="display:none";
      }
  }
  else{
    document.querySelector(".navBar").style="position:relative";
  }
})

function toggle(initialStatus, finalStatus){
  initialStatus.classList.toggle(finalStatus);
}


function toNight(){
  theme.classList.remove("ulTheme-block");
  stylesId.href="./STYLES/night-style.css";
  document.querySelector(".logo").src="./assets/gifOF_logo_dark.png"
  nightTheme.className="firstLetter";
  dayTheme.className="";
  window.localStorage.setItem("nightTheme", "true");
  document.querySelector(".dropdownImg").src="./assets/dropdown-white.svg"
}
function toDay(){
  theme.classList.remove("ulTheme-block");
  stylesId.href="./STYLES/day-style.css";
  document.querySelector(".logo").src="./assets/gifOF_logo.png"
  document.querySelector(".dropdownImg").src="./assets/dropdown.svg"
  dayTheme.className="firstLetter";
  nightTheme.className="";
  window.localStorage.removeItem("nightTheme")
}
function changeTheme(){
  nightTheme.addEventListener("click", toNight);
  dayTheme.addEventListener("click", toDay);
}

/*BOTON PARA TEMAS*/
dropdownBtn.addEventListener("click",()=> {
  toggle(document.querySelector(".ulTheme-none"),"ulTheme-block");  
  changeTheme();
});

document.getElementById("myGuifos").addEventListener("click",()=>{
  location.assign("./my-Gifos.html")
  window.sessionStorage.setItem("myGifosDirect", "true");
})

/*****************************SUGERENCIAS DE BUSQUEDA****************************/
async function searchSuggestingResults(){
autocomplete = await fetch('http://api.giphy.com/v1/gifs/search/tags?api_key='+ apiKey +'&q=' + input.value+"'")
.then(response=>response.json())
.then(data=>data)
.catch(console.error)
for(n=0;n<3;n++){
  autocomplete.data[n]?document.getElementsByClassName("divResults")[n].innerHTML=autocomplete.data[n].name:false}
}
/**********************************BUSCAR*****************************************/
document.getElementById("input").addEventListener("keyup", function(event){
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("searchBtn").click();
    resultsId.className="results results-none";
    document.querySelector(".searchSec").style="margin-bottom:0px";
  }});

document.getElementById("searchBtn").addEventListener("click",()=>{
  search = document.getElementById("input").value;
  resultsId.className="results results-none";
  document.querySelector(".searchSec").style="margin-bottom:0px";
  getSearchResults()});

document.getElementById("input").addEventListener("input",()=>{
  if(input.value===""){
    resultsId.className="results results-none";
    document.querySelector(".searchSec").style="margin-bottom:0px";
    document.getElementById("searchBtn").className="";
    document.getElementById("lupa").src="./assets/lupa_inactive.svg"
  }
  else{
    searchSuggestingResults()
    document.getElementById("searchBtn").className="searchingBtn";
    window.localStorage.getItem("nightTheme")?document.getElementById("lupa").src="./assets/lupa_light.svg":document.getElementById("lupa").src="./assets/lupa.svg"
    resultsId.className="results results-block";
    document.querySelector(".searchSec").style="margin-bottom:225px";
    
  }
})
var resultsArray=Array.from(document.getElementsByClassName("divResults"));
      resultsArray.forEach(element=>{
        element.addEventListener("click", ()=>{
          search=element.innerHTML;
          getSearchResults();
          resultsId.className="results results-none";
          document.querySelector(".searchSec").style="margin-bottom:0px";})
      })
/*RESULTADOS DE BUSQUEDA*/
async function getSearchResults() {
  if (search){
  document.getElementById("lupa").src="./assets/lupa_inactive.svg";
  const found = await fetch('https://api.giphy.com/v1/gifs/search?api_key='+ apiKey +'&q=' + search +'&limit=25&offset=0&rating=G&lang=en')
      .then(response => response.json())
      .then(data => data)
      .catch(console.error)
      document.querySelector(".body").innerHTML ="<section id='searching'><div class='searchTagsContainer'></div></section>";
      document.getElementById("searching").innerHTML+="<div class='subtitles'>" + search + " (resultados)</div><div class='gifyBox'></div>";
      (async function getTagsFunc(){
        const tags= await fetch('http://api.giphy.com/v1/tags/related/['+search+']?api_key='+apiKey)
        .then(response=>response.json())
        .then(data=>data)
      for(i=0;i<3;i++){
        document.querySelector(".searchTagsContainer").innerHTML+="<div class='searchTags'>"+tags.data[i].name+"</div>"        
        searchTagsArray= Array.from(document.getElementsByClassName("searchTags"));
        searchTagsArray.forEach(element=>{
          element.addEventListener("click", ()=>{search=element.innerHTML; getSearchResults()})
        })
      }})()
      found.data.forEach(element => {
        document.querySelector(".gifyBox").innerHTML+="<div class='gifos'><img src='http://media.giphy.com/media/"+ element.id+"/giphy.gif'></img>"
      });
      searching = document.getElementById("searching").querySelector(".gifyBox");
      gifos = Array.from(searching.getElementsByClassName("gifos"));
      for(i=4; i<=gifos.length-2; i= i+5){
        toggle(gifos[i], "gifos2");}  
  }
  else{
    alert("Debe ingresar al menos una letra para la búsqueda")
  }
  input.value="";
  document.getElementById("searchBtn").className="";
}

/*SUGERENCIAS*/
(function getSuggesting(){
  for(n=0; n<=3; n++){
    getSuggestingResults(n);
  }
})()

async function getSuggestingResults(n){
  const result = await fetch('https://api.giphy.com/v1/gifs/random?api_key='+ apiKey)
  .then(response=>response.json())
  .then(data=>data)
  .catch(console.error);
  document.getElementsByClassName("box")[n].innerHTML="<div class='barBox'><div>#"+result.data.title+"</div><img data-id='"+n+"' class='close' src='./assets/button-close.svg' alt='close'></div><div class='gifos'><img src='http://media.giphy.com/media/"+result.data.id+"/giphy.gif'></img></div><button class='seeMore'>Ver más...</button>";
  document.getElementsByClassName("seeMore")[n].addEventListener("click",()=>{result.data.title ==="" ?search="random":search="'"+result.data.title+"'";getSearchResults();})
  document.getElementsByClassName("close")[n].addEventListener("click", ()=>{getSuggestingResults(n)})}

/*TENDENCIAS*/
async function getTrending(){
  const result = await fetch('http://api.giphy.com/v1/gifs/trending?q=&api_key=' + apiKey)
  .then(response=>response.json())
  .then(data=>data)
  .catch(console.error);
  trending.innerHTML="";
  result.data.forEach(element => {
    trending.innerHTML+="<div class='gifosBox'><div class='gifos' data-id='"+element.title+"'><img src='http://media.giphy.com/media/"+element.id+"/giphy.gif'></img><div class='barBox'>#"+element.title+"</div></div></div>";
    });
  gifosBox=Array.from(trending.getElementsByClassName("gifosBox"))
  gifos = Array.from(trending.getElementsByClassName("gifos"));
  for(i=4; i<=gifos.length-2; i= i+5){
    toggle(gifosBox[i], "gifosBox2");
    toggle(gifos[i], "gifos2");}
    gifos.forEach(element=>{element.addEventListener("click",()=>{search="'"+element.dataset.id+"'"; getSearchResults();});});
}
getTrending();

/*crear gifos*/
document.getElementById("newGifoBtn").addEventListener("click",()=>{
  location.assign("./my-Gifos.html");
  window.sessionStorage.removeItem("myGifosDirect");
})
