let rewardImages = [];
let wordImages = {
  "الله": "",
  "الحی": ""
};
let targetWord = "";
const words = ["الله", "الحی"];
let isGuessLocked = false;

// بارگذاری داده‌ها از LocalStorage
window.onload = function() {
  const savedRewards = localStorage.getItem('game_rewards');
  if (savedRewards) rewardImages = JSON.parse(savedRewards);

  const savedAllah = localStorage.getItem('word_allah');
  if (savedAllah) wordImages["الله"] = savedAllah;

  const savedAlhai = localStorage.getItem('word_alhai');
  if (savedAlhai) wordImages["الحی"] = savedAlhai;

  resetGame();
};

// پنل تنظیمات
document.getElementById('toggleSettings').addEventListener('click', function() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('hidden');
});

// آپلود عکس ۱۰ تایی جایزه
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

// آپلود عکس الله
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

// آپلود عکس الحی
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

// شروع/ریست بازی
function resetGame() {
  targetWord = words[Math.floor(Math.random() * words.length)];
  isGuessLocked = false;

  const heart = document.getElementById('heart');
  const rewardContainer = document.getElementById('rewardContainer');
  const resetBtn = document.getElementById('resetBtn');

  heart.classList.remove('fade-out');
  heart.classList.add('beating');
  rewardContainer.classList.add('hidden');
  resetBtn.classList.add('hidden');
  document.getElementById('message').innerText = "";
}

// حدس زدن
function makeGuess(guessedWord) {
  if (isGuessLocked) return;

  const message = document.getElementById('message');

  if (guessedWord === targetWord) {
    isGuessLocked = true;
    message.style.color = "#34c759";
    message.innerText = "آفرین! درست حدس زدی 🎉";

    const heart = document.getElementById('heart');
    
    // ۱. محو شدن تدریجی طی ۵ ثانیه
    heart.classList.remove('beating'); // متوقف شدن تپش موقع محو شدن
    heart.classList.add('fade-out');

    // ۲. نمایش تصویر کلمه یا جایزه بعد از ۵ ثانیه
    setTimeout(() => {
      const rewardContainer = document.getElementById('rewardContainer');
      const rewardImg = document.getElementById('rewardImage');

      // اگر برای کلمه حدس زده شده عکس آپلود شده باشد، ابتدا آن را نشان می‌دهد
      if (wordImages[targetWord]) {
        rewardImg.src = wordImages[targetWord];
        rewardContainer.classList.remove('hidden');

        // بعد از ۲ ثانیه، یکی از ۱۰ عکس جایزه را نشان می‌دهد
        setTimeout(() => {
          if (rewardImages.length > 0) {
            const randomReward = rewardImages[Math.floor(Math.random() * rewardImages.length)];
            rewardImg.src = randomReward;
          }
        }, 2000);

      } else if (rewardImages.length > 0) {
        // اگر عکس کلمه نبود مستقیم یکی از ۱۰ عکس جایزه
        const randomReward = rewardImages[Math.floor(Math.random() * rewardImages.length)];
        rewardImg.src = randomReward;
        rewardContainer.classList.remove('hidden');
      }

      // نمایش دکمه بازی مجدد
      document.getElementById('resetBtn').classList.remove('hidden');

    }, 5000); // زمان ۵ ثانیه برای محو شدن کامل

  } else {
    message.style.color = "#ff3b30";
    message.innerText = "اشتباه بود! دوباره حدس بزن ❌";
  }
}
