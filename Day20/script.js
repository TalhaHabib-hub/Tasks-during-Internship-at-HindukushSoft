let show = document.querySelector(".show");
let list = JSON.parse(localStorage.getItem("data")) || [];
adder();
let screen = document.querySelector(".screen");
let time = document.querySelector("#time");
document.querySelector(".save").addEventListener("click", () => {
  if (screen.value != "" && time.value != "") {
    list.unshift({ task: `${screen.value}`, timetaken: `${time.value}` });
    screen.value = "";
    time.value = "";
    localStorage.setItem("data", JSON.stringify(list));
    adder();
  }
});
function adder() {
  show.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    show.innerHTML += `
      <div class="stores">
        <span class="task">${list[i].task}</span>
        <span class="timetaken">${list[i].timetaken}</span>
        <button class="delete" onclick =' removeIt(${i})'>done!
        </button>
      </div>`;
  }
}
function removeIt(idx) {
  list = list.filter((item, i) => i !== idx);
  localStorage.setItem("data", JSON.stringify(list));
  adder();
}
document.querySelector(".changeMood").addEventListener("click", () => {
  let checkmood = document.documentElement.getAttribute("new-theme");
  if (checkmood === "Talha") {
    document.documentElement.removeAttribute("new-theme");
  } else {
    document.documentElement.setAttribute("new-theme", "Talha");
  }
});
