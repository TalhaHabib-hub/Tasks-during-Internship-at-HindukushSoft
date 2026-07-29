let inputName = document.querySelector("#name");
let inputEmail = document.querySelector("#email");
let inputText = document.querySelector("textarea");
let nameError = document.querySelector("#nameMessageError");
let emailError = document.querySelector("#emailMessageError");
let textError = document.querySelector("#messageMessageError");
let count = 0;
let success = document.querySelector('.success');
let submit = document.querySelector('#submitbut');
document.querySelector("#submitbut").addEventListener("click",() => {    
    callChecker();
    count++;
    checkSuccess();
  });

let list = [inputEmail, inputName, inputText];
list.forEach((each) => {
    each.addEventListener('focus', () => {
    each.style.borderColor='rgba(255, 255, 255,0.7)';
  if (count > 0) {
      callChecker();}
    });
  
});
list.forEach((each) => {
    each.addEventListener('blur', () => {
    each.style.borderColor="rgb(101, 96, 96)";
  if (count > 0) {
      callChecker();}
    });
  
});


function callChecker() {
  if (inputName.value == "") {
    nameError.style.opacity = 1;
    inputName.style.borderColor = "#E11D48";
  } else {
    nameError.style.opacity = 0;
    inputName.style.borderColor = "rgb(101, 96, 96)";
  }
  if (inputEmail.value == "") {
    emailError.style.opacity = 1;
    inputEmail.style.borderColor = "#E11D48";
  } else {
    emailError.style.opacity = 0;
    inputEmail.style.borderColor = "rgb(101, 96, 96)";
  }
  if (inputText.value == "") {
    textError.style.opacity = 1;
    inputText.style.borderColor = "#E11D48";
  } else {
    textError.style.opacity = 0;
    inputText.style.borderColor = "rgb(101, 96, 96)";
  }

}
function checkSuccess(){
  if(inputName.value != "" && inputEmail.value != "" && inputText.value != ""){
     success.style.opacity = 1;
  }
}