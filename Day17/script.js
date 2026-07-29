let button = document.querySelector('.original');
let originalColor = document.querySelector('.original').style.backgroundColor;
let originalText = document.querySelector('.original').innerText;
let originalTextColor = document.querySelector('.original').style.color;
let newTextColor = 'purple';
let newText = 'aqua';
let newColor = 'deepskyblue';


button.addEventListener('click', ()=>{
  button.style.backgroundColor = button.style.backgroundColor===originalColor?newColor:originalColor;

  button.style.color = button.style.color===originalTextColor?newTextColor:originalTextColor;

  button.innerText = button.innerText===originalText?newText:originalText;
})


