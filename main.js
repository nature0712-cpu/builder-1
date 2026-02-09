const drawBtn = document.getElementById('drawBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const ballsDiv = document.getElementById('balls');
const historyDiv = document.getElementById('history');
const animalTestBtn = document.getElementById('animal-test-btn');

const lottoHistory = JSON.parse(localStorage.getItem('lottoHistory')) || [];

// ✅ 번호 생성 함수
function createNumbers() {
  const numbers = new Set(); // 중복 방지를 위해 Set 사용
  while (numbers.size < 7) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }
  return Array.from(numbers);
}

// ✅ 공 색상 결정 함수
function getBallColor(num) {
  if (num <= 10) return 'r1';
  if (num <= 20) return 'r2';
  if (num <= 30) return 'r3';
  if (num <= 40) return 'r4';
  return 'r5';
}

// ✅ 번호 렌더링 함수
function renderBalls(numbers) {
  ballsDiv.innerHTML = ''; // 기존 번호 초기화
  numbers.forEach((num, i) => {
    const ball = document.createElement('div');
    ball.className = `ball ${getBallColor(num)} roll`;
    ball.textContent = num;
    ball.style.animationDelay = `${i * 100}ms`;
    ballsDiv.appendChild(ball);
  });
  copyBtn.disabled = false;
}

// ✅ 기록 렌더링 함수
function renderHistory() {
  historyDiv.innerHTML = ''; // 기존 기록 초기화
  const recentHistory = lottoHistory.slice(-3).reverse(); // 최신 3개만

  if (recentHistory.length === 0) {
    historyDiv.innerHTML = '<div class="histItem">기록이 없습니다.</div>';
    return;
  }

  recentHistory.forEach(item => {
    const histItem = document.createElement('div');
    histItem.className = 'histItem';

    const time = new Date(item.time).toLocaleString('ko-KR');
    const histTime = document.createElement('div');
    histTime.className = 'histTime';
    histTime.textContent = time;

    const histBalls = document.createElement('div');
    histBalls.className = 'histBalls';

    item.numbers.forEach(num => {
      const ball = document.createElement('div');
      ball.className = `ball sm ${getBallColor(num)}`;
      ball.textContent = num;
      histBalls.appendChild(ball);
    });

    histItem.appendChild(histTime);
    histItem.appendChild(histBalls);
    historyDiv.appendChild(histItem);
  });
}


// ✅ 번호 뽑기
drawBtn.addEventListener('click', () => {
  const numbers = createNumbers();
  renderBalls(numbers);

  // 기록 저장
  lottoHistory.push({ numbers, time: new Date() });
  localStorage.setItem('lottoHistory', JSON.stringify(lottoHistory));
  renderHistory();
});


// ✅ 현재 번호 복사
copyBtn.addEventListener('click', () => {
  const balls = ballsDiv.querySelectorAll('.ball');
  const numbersText = Array.from(balls).map(b => b.textContent).join(', ');
  
  navigator.clipboard.writeText(numbersText)
    .then(() => alert('번호가 복사되었습니다!'))
    .catch(err => console.error('복사 실패: ', err));
});


// ✅ 기록 지우기
clearBtn.addEventListener('click', () => {
  if (confirm('정말 모든 기록을 지우시겠습니까?')) {
    lottoHistory.length = 0; // 배열 비우기
    localStorage.removeItem('lottoHistory');
    renderHistory();
    ballsDiv.innerHTML = '';
    copyBtn.disabled = true;
  }
});

// ✅ 동물상 테스트 페이지로 이동
animalTestBtn.addEventListener('click', () => {
  window.location.href = 'animal-test.html';
});

// 초기 기록 렌더링
renderHistory();


// 테마 토글
const themeToggleButton = document.getElementById('theme-toggle-button');

themeToggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  
  // 버튼 텍스트와 아이콘 업데이트
  if (document.body.classList.contains('light-mode')) {
    themeToggleButton.textContent = '🌙 다크 모드';
  } else {
    themeToggleButton.textContent = '☀️ 라이트 모드';
  }
});