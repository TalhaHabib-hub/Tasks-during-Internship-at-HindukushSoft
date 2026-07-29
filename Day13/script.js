let name = prompt('What is your name dear?');
let messageShower = document.querySelector('#greeter');

function greet(name){
  messageShower.innerText=`You are wellcome dear ${name}.`
}

greet(name);