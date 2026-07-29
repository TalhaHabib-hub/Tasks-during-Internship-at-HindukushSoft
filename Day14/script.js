let shoppingList = ['shirt','cap','tie','coat','purse'];

for(let i = 0; i<shoppingList.length;i++){
  console.log(shoppingList[i]);
}

let display = document.querySelector('#display');
let list = document.querySelector('.list');

let all = '';
shoppingList.forEach(item => {
  all+=`
    <P>${item}</p>
  `
});
list.innerText+=shoppingList;
display.innerHTML=all;