document.addEventListener("DOMContentLoaded", function () {
    const countdownTimer = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
  
    const refreshInterval = 2 * 24 * 60 * 60 * 1000; // 2 dagen in milliseconden
  
    let lastRefreshTime = localStorage.getItem('lastRefreshTime');
    if (!lastRefreshTime) {
      lastRefreshTime = new Date().getTime();
      localStorage.setItem('lastRefreshTime', lastRefreshTime); 
    } else {
      lastRefreshTime = parseInt(lastRefreshTime);
    }
  
    function updateCountdown() {
      const now = new Date().getTime();
      const nextRefreshTime = lastRefreshTime + refreshInterval;
  
      const distance = nextRefreshTime - now;
  
      if (distance < 0) {
        lastRefreshTime = new Date().getTime();
        localStorage.setItem('lastRefreshTime', lastRefreshTime);
        updateCountdown();
        return;
      }
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      countdownTimer.days.innerHTML = days.toString().padStart(2, '0');
      countdownTimer.hours.innerHTML = hours.toString().padStart(2, '0');
      countdownTimer.minutes.innerHTML = minutes.toString().padStart(2, '0');
      countdownTimer.seconds.innerHTML = seconds.toString().padStart(2, '0');
    }
  
    setInterval(updateCountdown, 1000);
  
    updateCountdown();
  });
  