const nameToStore = document.querySelector('#name');
const save = document.querySelector('.save');
const screen = document.querySelector('#screen');
const card = document.querySelector('.card')
const storeName  = document.querySelector('.storeName');
const theme = document.querySelector('.theme');

let themeState;


const la = document.body;
// changing all
theme.addEventListener('click',()=>{
  if (la.style.color === 'rgb(16, 8, 50)'){
    themeState = 'light-dark';
    localStorage.setItem('theme',themeState);
    showScreen();
la.style.color = 'rgb(167, 169, 199)';
la.style.backgroundColor = ' rgb(167, 169, 199)';
card.style.backgroundColor =' rgb(16, 8, 50)'; 
storeName.style.border= '2px solid rgb(167, 169, 199)';
nameToStore.style.backgroundColor = ' rgb(16, 8, 50)' 
nameToStore.style.color = ' rgb(167, 169, 199)' 
save.style.backgroundColor = 'rgb(167, 169, 199)'
save.style.color = 'rgb(16, 8, 50)';
theme.style.color = 'rgb(16, 8, 50)';
theme.style.backgroundColor = 'rgb(167, 169, 199)';
screen.style.color= 'rgb(167, 169, 199)';
screen.style.backgroundColor = 'rgb(16, 8, 50)';
screen.style.border = ' 2px solid  rgb(167, 169, 199)';}
else{
  themeState = 'dark-light';
  localStorage.setItem('theme',themeState);
   showScreen();
la.style.color = 'rgb(16, 8, 50)';
la.style.backgroundColor = ' rgb(16, 8, 50)';
card.style.backgroundColor ='  rgb(167, 169, 199)'; 
storeName.style.border= '2px solid rgb(16, 8, 50)';
nameToStore.style.backgroundColor = 'rgb(167, 169, 199)' 
nameToStore.style.color = ' rgb(16, 8, 50)' 
save.style.backgroundColor = 'rgb(16, 8, 50)'
save.style.color = 'rgb(167, 169, 199)';
theme.style.color = 'rgb(167, 169, 199)';
theme.style.backgroundColor = 'rgb(16, 8, 50)';
screen.style.color= 'rgb(16, 8, 50)';
screen.style.backgroundColor = 'rgb(167, 169, 199)';
screen.style.border = ' 2px solid  rgb(16, 8, 50)';
}
}
)









save.addEventListener('click',()=>{
  savefunction();
  showScreen();
}
)
function savefunction(){
  if(nameToStore.value !== ''){
localStorage.setItem('name',nameToStore.value)}
 
}




function showScreen(){

 screen.value = `Stored name :${localStorage.getItem('name')} \n Currnet theme ${localStorage.getItem('theme')}`
}
