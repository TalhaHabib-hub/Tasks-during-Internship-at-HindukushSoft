const p = document.querySelector('p');
const button = document.querySelector('button');
const pOriginalColor = document.querySelector('p').style.color;
const pNewColor = 'red';

const originalText = document.querySelector('p').innerText;
const newText = 'You clicked the button';

button.addEventListener('click',()=>{
  p.innerText = p.innerText===originalText? newText: originalText;
  p.style.color=p.style.color===pOriginalColor? pNewColor : pOriginalColor;
})