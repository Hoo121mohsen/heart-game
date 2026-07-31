let rewardImages = [];
let wordImages = { "الله": "", "الحی": "" };
let targetWord = "";
const words = ["الله", "الحی"];
let isGuessLocked = false;

// متغیرهای مربوط به حرکت دایره سیاه
let dotPos = { x: 0, y: 0 };
let dotVel = { x: 2, y: 1.5 };
let animFrameId = null;

window.onload = function() {
  const savedRewards = localStorage.getItem('game_rewards');
  if (savedRewards) rewardImages = JSON.parse(savedRewards);

  const savedAllah = localStorage.getItem('word_allah');
  if (savedAllah) wordImages["الله"] = savedAllah;

  const savedAlhai = localStorage.getItem('word_alhai');
  if (savedAlhai) wordImages["الحی"] = savedAlhai;

  resetGame();
};

document.getElementById('toggleSettings').addEventListener('click', function() {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});

// مدیریت آپلودها
document.getElementById('imageInput').addEventListener('change', function(e) {
  const files = Array.from(e.target.files).slice(0, 10);
  rewardImages = [];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      rewardImages.push(event.target.result);
      if (rewardImages.length === files.length) {
        localStorage.setItem('game_rewards', JSON.stringify(rewardImages));
        showStatus("عکس‌های جایزه ذخیره شدند!");
      }
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById('allahInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      wordImages["الله"] = event.target.result;
      localStorage.setItem('word_allah', event.target.result);
      showStatus("عکس الله ذخیره شد!");
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('alhaiInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      wordImages["الحی"] = event.target.result;
      localStorage.setItem('word_alhai', event.target.result);
      showStatus("عکس الحی ذخیره شد!");
    };
    reader.readAsDataURL(file);
  }
});

function showStatus(text) {
  const status = document.getElementById('uploadStatus');
  status.innerText = text;
  setTimeout(() => status.innerText = "", 3000);
}

// انیمیشن حرکت دایره داخل قلب
function moveDot() {
  const dot = document.getElementById('blackDot');
  
  // محدود کردن حرکت درون قلب
  dotPos.x += dotVel.x;
  dotPos.y += dotVel.y;

  if (dotPos.x < 10 || dotPos.x > 120) dotVel.x *= -1;
  if (dotPos.y < 10 || dotPos.y > 120) dotVel.y *= -1;

  dot.style.left = dotPos.x + 'px';
  dot.style.top = dotPos.y + 'px';

  animFrameId = requestAnimationFrame(moveDot);
}

function resetGame() {
  targetWord = words[Math.floor(Math.random() * words.length)];
  isGuessLocked = false;

  const heart = document.getElementById('heart');
  const rewardContainer = document.getElementById('rewardContainer');
  const resetBtn = document.getElementById('resetBtn');

  heart.classList.remove('fade-out');
  rewardContainer.classList.add('hidden');
  resetBtn.classList.add('hidden');
  document.getElementById('message').innerText = "";

  // شروع مجدد انیمیشن حرکت دایره
  dotPos = { x: 10, y: 10 };
  dotVel = { x: 2.5, y: 1.8 };
  if (animFrameId) cancelAnimationFrame(animFrameId);
  moveDot();
}

// بررسی اینکه آیا دایره سیاه داخل حفره قرار دارد یا خیر
function isDotInHole() {
  // مرکز حفره در (67, 67) و شعاع آن 25px است
  // مرکز دایره در (dotPos.x + 13, dotPos.y + 13) قرار دارد
  const dotCenterX = dotPos.x + 13;
  const dotCenterY = dotPos.y + 13;
  const holeCenterX = 80;
  const holeCenterY = 80;

  const distance = Math.sqrt(
    Math.pow(dotCenterX - holeCenterX, 2) + Math.pow(dotCenterY - holeCenterY, 2)
  );

  return distance <= 18; // اگر فاصله مرکز دایره تا حفره کمتر از ۱۸ پیکسل باشد یعنی کاملا وارد شده
}

function makeGuess(guessedWord) {
  if (isGuessLocked) return;

  const message = document.getElementById('message');

  // ۱. اول بررسی می‌کنیم دایره داخل حفره هست یا نه
  if (!isDotInHole()) {
    message.style.color = "#ff9500";
    message.innerText = "هنوز زوده حدس بزنی! ⏳";
    return;
  }

  // ۲. اگر داخل حفره بود، حدس کاربر بررسی می‌شود
  if (guessedWord === targetWord) {
    isGuessLocked = true;
    if (animFrameId) cancelAnimationFrame(animFrameId); // متوقف شدن دایره سیاه

    message.style.color = "#34c759";
    message.innerText = "آفرین! درست حدس زدی 🎉";

    const heart = document.getElementById('heart');
    heart.classList.add('fade-out');

    // محو شدن طی ۱۰ ثانیه (10000 میلی‌ثانیه)
    setTimeout(() => {
      const rewardContainer = document.getElementById('rewardContainer');
      const rewardImg = document.getElementById('rewardImage');

      if (wordImages[targetWord]) {
        rewardImg.src = wordImages[targetWord];
        rewardContainer.classList.remove('hidden');

        setTimeout(() => {
          if (rewardImages.length > 0) {
            const randomReward = rewardImages[Math.floor(Math.random() * rewardImages.length)];
            rewardImg.src = randomReward;
          }
        }, 2000);

      } else if (rewardImages.length > 0) {
        const randomReward = rewardImages[Math.floor(Math.random() * rewardImages.length)];
        rewardImg.src = randomReward;
        rewardContainer.classList.remove('hidden');
      }

      document.getElementById('resetBtn').classList.remove('hidden');

    }, 10000);

  } else {
    message.style.color = "#ff3b30";
    message.innerText = "اشتباه بود! دوباره سعی کن ❌";
  }
}
