const ballsEl = document.getElementById("balls");
const historyEl = document.getElementById("history");
const drawBtn = document.getElementById("drawBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const STORAGE = "lotto_history_center";
const THEME_STORAGE_KEY = "lotto_theme_preference";
const MAX = 3;

let current = null;
let history = JSON.parse(localStorage.getItem(STORAGE) || "[]");

function rangeClass(n){
  if(n<=10) return "r1";
  if(n<=20) return "r2";
  if(n<=30) return "r3";
  if(n<=40) return "r4";
  return "r5";
}

function generate(){
  const nums=[];
  while(nums.length<7){
    const n=Math.floor(Math.random()*45)+1;
    if(!nums.includes(n)) nums.push(n);
  }
  return { main:nums.slice(0,6).sort((a,b)=>a-b), bonus:nums[6] };
}

function renderCurrent(){
  ballsEl.innerHTML="";
  copyBtn.disabled=true;

  const all=[...current.main, "+", current.bonus];

  all.forEach((v,i)=>{
    setTimeout(()=>{
      if(v==="+"){
        const p=document.createElement("div");
        p.textContent="+";
        p.style.fontWeight="900";
        ballsEl.appendChild(p);
        return;
      }
      const b=document.createElement("div");
      b.className=`ball ${rangeClass(v)} roll`;
      b.textContent=String(v);
      ballsEl.appendChild(b);
      if(i===all.length-1) copyBtn.disabled=false;
    }, i*130);
  });
}

function saveHistory(){
  localStorage.setItem(STORAGE, JSON.stringify(history));
}

function renderHistory(){
  historyEl.innerHTML = "";
  history.forEach(h => {
    if (!h || typeof h !== 'object') return; // Skip invalid entries

    const item = document.createElement("div");
    item.className = "histItem";

    const timeDiv = document.createElement("div");
    timeDiv.className = "histTime";
    timeDiv.textContent = h.time ? new Date(h.time).toLocaleString() : '';
    item.appendChild(timeDiv);

    const row = document.createElement("div");
    row.className = "histBalls";

    if (h.main && Array.isArray(h.main)) {
        h.main.forEach(n => {
            const b = document.createElement("div");
            b.className = `ball sm ${rangeClass(n)}`;
            b.textContent = String(n);
            row.appendChild(b);
        });
    }

    if (h.bonus) {
        const bb = document.createElement("div");
        bb.className = `ball sm ${rangeClass(h.bonus)}`;
        bb.textContent = String(h.bonus);
        row.appendChild(bb);
    }

    item.appendChild(row);
    historyEl.appendChild(item);
  });
}

drawBtn.onclick=()=>{
  current=generate();
  renderCurrent();
  history.unshift({ ...current, time:new Date().toLocaleString() });
  history=history.slice(0,MAX);
  saveHistory();
  renderHistory();
};

copyBtn.onclick=()=>{
  if (!current) return;
  const mainNumbers = current.main.join(' ');
  const textToCopy = `${mainNumbers} + ${current.bonus}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('번호가 복사되었습니다!');
  }).catch(err => {
    console.error('복사 실패:', err);
  });
};

clearBtn.onclick=()=>{
  history=[];
  saveHistory();
  renderHistory();
};

renderHistory();


// Theme Toggle Logic
const themeToggleButton = document.getElementById("theme-toggle-button");
const body = document.body;

// Function to set the theme
function setTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-mode");
    themeToggleButton.textContent = "🌙 다크 모드";
  } else {
    body.classList.remove("light-mode");
    themeToggleButton.textContent = "☀️ 라이트 모드";
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

// Function to toggle the theme
function toggleTheme() {
  const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

// Event listener for the theme toggle button
themeToggleButton.addEventListener("click", toggleTheme);

// Apply saved theme on page load
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Default to dark mode if no preference is saved
  setTheme("dark");
}