let images = [];
let targetWord = "";
const words = ["الله", "الحی"];

// بارگذاری عکس‌های ذخیره‌شده از قبل (در صورت وجود)
window.onload = function() {
  const savedImages = localStorage.getItem('game_images');
  if (savedImages) {
    images = JSON.parse(savedImages);
    renderGallery();
  }
  resetGame();
};

// دریافت و ذخیره عکس‌ها از گالری
document.getElementById('imageInput').addEventListener('change', function(e) {
  const files = Array.from(e.target.files).slice(0, 10);
  
  images = [];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      images.push(event.target.result);
      if (images.length === files.length) {
        localStorage.setItem('game_images', JSON.stringify(images));
        renderGallery();
      }
    };
    reader.readAsDataURL(file);
  });
});

function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = "";
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    gallery.appendChild(img);
  });
}

function resetGame() {
  targetWord = words[Math.floor(Math.random() * words.length)];
  const heart = document.getElementById('heart');
  const rewardContainer = document.getElementById('rewardContainer');
  
  heart.classList.remove('fade-out');
  rewardContainer.classList.add('hidden');
  document.getElementById('message').innerText = "";
}

function makeGuess(guessedWord) {
  const message = document.getElementById('message');
  
  if (guessedWord === targetWord) {
    message.style.color = "green";
    message.innerText = "آفرین! درست حدس زدی 🎉";
    
    // محو شدن تدریجی قلب
    const heart = document.getElementById('heart');
    heart.classList.add('fade-out');
    
    // نمایش تصویر جایزه در صورت وجود عکس
    if (images.length > 0) {
      const randomImg = images[Math.floor(Math.random() * images.length)];
      document.getElementById('rewardImage').src = randomImg;
      document.getElementById('rewardContainer').classList.remove('hidden');
    }
  } else {
    message.style.color = "red";
    message.innerText = "اشتباه بود! دوباره حدس بزن ❌";
  }
}

