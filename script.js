// ========== PARTICLES CANVAS ==========
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        const palette = ['#ff5a8c', '#ff85a8', '#c8a27c', '#e6c7a8'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw subtle connections
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = '#ff5a8c';
                ctx.globalAlpha = 0.03 * (1 - dist / 120);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();



// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ========== MUSIC PLAYER ==========
const musicBtn = document.getElementById('music-btn');
const voiceAudio = document.getElementById('voice-audio');
let isPlaying = false;

musicBtn.addEventListener('click', async () => {
    try {
        if (!isPlaying) {
            if (voiceAudio.ended) voiceAudio.currentTime = 0;
            await voiceAudio.play();
            isPlaying = true;
            musicBtn.querySelector('.music-icon').textContent = '⏸️';
            musicBtn.querySelector('.music-label').textContent = 'Playing...';
            musicBtn.classList.add('playing');
        } else {
            voiceAudio.pause();
            isPlaying = false;
            musicBtn.querySelector('.music-icon').textContent = '▶️';
            musicBtn.querySelector('.music-label').textContent = 'Play Our Voice Note';
            musicBtn.classList.remove('playing');
        }
    } catch (e) {
        alert('Tap again — phones block audio until you interact.');
    }
});

voiceAudio.addEventListener('ended', () => {
    isPlaying = false;
    musicBtn.querySelector('.music-icon').textContent = '▶️';
    musicBtn.querySelector('.music-label').textContent = 'Play Our Voice Note';
    musicBtn.classList.remove('playing');
});

// ========== COUNTER ==========
const startDate = new Date(2026, 1, 18); // Feb 18, 2026

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    const heartbeats = days * 100000;

    animateNumber('days-count', days);
    animateNumber('hours-count', hours);
    animateNumber('heartbeats-count', heartbeats);
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
    if (current === target) return;

    const increment = Math.ceil(Math.abs(target - current) / 40);
    let value = current;

    const timer = setInterval(() => {
        value += increment;
        if (value >= target) {
            value = target;
            clearInterval(timer);
        }
        el.textContent = value.toLocaleString();
    }, 25);
}

updateCounter();
setInterval(updateCounter, 60000);



// ========== ENVELOPE ==========
const envelope = document.getElementById('envelope');
const envelopeHint = document.getElementById('envelope-hint');

envelope.addEventListener('click', () => {
    envelope.classList.toggle('opened');
    envelopeHint.textContent = envelope.classList.contains('opened')
        ? '💌 Click to close'
        : '✉️ Click to open the letter';
});

// ========== REASONS CAROUSEL ==========
const track = document.getElementById('reasons-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('carousel-dots');
let currentSlide = 0;

function getCardsPerView() {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
}

function getCardWidth() {
    const card = document.querySelector('.reason-card');
    return card ? card.offsetWidth + 24 : 304;
}

function getTotalSlides() {
    const totalCards = document.querySelectorAll('.reason-card').length;
    return Math.max(1, totalCards - getCardsPerView() + 1);
}

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * getCardWidth()}px)`;
    updateDots();
}

function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < getTotalSlides(); i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); });
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

prevBtn.addEventListener('click', () => { currentSlide = Math.max(0, currentSlide - 1); updateCarousel(); });
nextBtn.addEventListener('click', () => { currentSlide = Math.min(getTotalSlides() - 1, currentSlide + 1); updateCarousel(); });

createDots();
window.addEventListener('resize', () => { currentSlide = 0; createDots(); updateCarousel(); });

// Auto-advance
setInterval(() => { currentSlide = (currentSlide + 1) % getTotalSlides(); updateCarousel(); }, 4500);

// ========== TIMELINE SCROLL ANIMATION ==========
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

timelineItems.forEach(item => timelineObserver.observe(item));

// ========== GENERAL SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reason-card, .gallery-item, .love-meter-box, .promise-box, .plan-item');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});



// ========== LOVE METER ==========
const loveMeter = document.querySelector('.love-meter');
const meterFill = document.getElementById('meter-fill');
const meterText = document.getElementById('meter-text');
const meterResult = document.getElementById('meter-result');

const loveMessages = [
    { min: 0, max: 20, text: "Loading love..." },
    { min: 20, max: 40, text: "Getting warmer..." },
    { min: 40, max: 60, text: "Love increasing! 💕" },
    { min: 60, max: 80, text: "Almost overflowing! 💖" },
    { min: 80, max: 95, text: "Maximum love reached! 🔥" },
    { min: 95, max: 101, text: "LOVE OVERFLOW ERROR! 💕💕💕" },
];

loveMeter.addEventListener('mousemove', (e) => {
    const rect = loveMeter.getBoundingClientRect();
    let percent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    meterFill.style.width = percent + '%';
    meterText.textContent = Math.round(percent) + '%';
    const msg = loveMessages.find(m => percent >= m.min && percent < m.max);
    meterResult.textContent = msg ? msg.text : '';
});

loveMeter.addEventListener('mouseleave', () => {
    meterFill.style.width = '100%';
    meterText.textContent = '∞%';
    meterResult.textContent = "Trick question — it's always infinite for you, Priyal! 💕";
});

loveMeter.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = loveMeter.getBoundingClientRect();
    let percent = Math.min(100, Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100));
    meterFill.style.width = percent + '%';
    meterText.textContent = Math.round(percent) + '%';
    const msg = loveMessages.find(m => percent >= m.min && percent < m.max);
    meterResult.textContent = msg ? msg.text : '';
});

// ========== CONFETTI ==========
function launchConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#e91e63', '#ff6090', '#f48fb1', '#ffd700', '#ff4081', '#fff', '#9c27b0'];

    for (let i = 0; i < 180; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                z-index: 99999;
                pointer-events: none;
                animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            container.appendChild(piece);
            setTimeout(() => piece.remove(), 5000);
        }, i * 15);
    }

    // Also spawn some hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = ['❤️', '💖', '💕', '🎉', '✨'][Math.floor(Math.random() * 5)];
            heart.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -20px;
                font-size: ${Math.random() * 20 + 15}px;
                z-index: 99999;
                pointer-events: none;
                animation: confetti-fall ${Math.random() * 4 + 3}s linear forwards;
            `;
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        }, i * 50);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);



// ========== FINALE BUTTONS + NPC ==========
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const celebration = document.getElementById('celebration');
const finaleButtons = document.querySelector('.finale-buttons');
const npc = document.getElementById('npc');
const npcText = document.getElementById('npc-text');

// YES button
btnYes.addEventListener('click', () => {
    finaleButtons.classList.add('hidden');
    celebration.classList.remove('hidden');
    launchConfetti();
    npc.classList.remove('show');
});

// NO button — runs away + triggers NPC
const npcLines = [
    "Okay... we're clicking NO now? Bold move, Priyal.",
    "You know he practiced this speech 14 times right?",
    "He built TWO websites for you. TWO. And sat through nail appointments.",
    "Your name is literally on his dissertation. PERMANENTLY.",
    "Don't make me activate emotional dialogue mode...",
    "Fine. Serious voice: He really really loves you.",
    "Now press YES before I unlock desperation DLC 😭"
];

let noCount = 0;
let isTyping = false;

function typeText(el, text, speed = 18) {
    el.textContent = '';
    isTyping = true;
    let i = 0;
    const timer = setInterval(() => {
        el.textContent += text[i] || '';
        i++;
        if (i > text.length) { clearInterval(timer); isTyping = false; }
    }, speed);
}

btnNo.addEventListener('pointerdown', (e) => {
    // Move the button
    const wrapper = document.getElementById('btn-no-wrapper');
    const maxX = Math.min(window.innerWidth * 0.3, 200);
    const maxY = 80;
    const rx = (Math.random() - 0.5) * 2 * maxX;
    const ry = (Math.random() - 0.5) * 2 * maxY;
    wrapper.style.transform = `translate(${rx}px, ${ry}px)`;

    // Show NPC
    noCount++;
    const line = npcLines[Math.min(noCount - 1, npcLines.length - 1)];
    npc.classList.add('show');
    typeText(npcText, line);

    // After too many tries, auto-yes
    if (noCount >= 7) {
        setTimeout(() => {
            finaleButtons.classList.add('hidden');
            celebration.classList.remove('hidden');
            launchConfetti();
            npc.classList.remove('show');
        }, 2000);
    }
});

// Also make no button dodge on hover (desktop)
btnNo.addEventListener('mouseenter', () => {
    if (noCount > 0) {
        const wrapper = document.getElementById('btn-no-wrapper');
        const rx = (Math.random() - 0.5) * 300;
        const ry = (Math.random() - 0.5) * 100;
        wrapper.style.transform = `translate(${rx}px, ${ry}px)`;
    }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== CONSOLE EASTER EGG ==========
console.log('%c❤️ Made with love for Priyal ❤️', 'font-size: 20px; color: #e91e63;');
console.log('%cIf you\'re reading this code... yes, I love her this much.', 'font-size: 14px; color: #ff6090;');
console.log('%cv2.0 — Because she deserves an upgrade every day.', 'font-size: 12px; color: #f48fb1;');



// ========== CALENDAR ==========
const calGrid = document.getElementById('cal-grid');
const calMonthYear = document.getElementById('cal-month-year');
const calPrev = document.getElementById('cal-prev');
const calNext = document.getElementById('cal-next');
const calNote = document.getElementById('cal-note');
const countdownValue = document.getElementById('countdown-value');

let calDate = new Date();

// Recurring date plans keyed by day-of-month (customizable!)
const datePlans = {
    18: { type: 'special', label: 'Our monthly anniversary 💕 — celebrate us!' },
    7:  { type: 'date-night', label: 'Coffee date ☕ — find a new cozy cafe' },
    14: { type: 'date-night', label: 'Movie night 🎬 — your pick, my cuddles' },
    25: { type: 'date-night', label: 'Sunset drive 🌅 — windows down, our playlist on' },
};

const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const today = new Date();

    calMonthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calGrid.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        calGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = day;

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        const plan = datePlans[day];
        if (plan) {
            cell.classList.add(plan.type, 'has-plan');
            cell.addEventListener('click', () => {
                document.querySelectorAll('.cal-day.selected').forEach(d => d.classList.remove('selected'));
                cell.classList.add('selected');
                calNote.textContent = plan.label;
                calNote.classList.add('active');
            });
        }

        calGrid.appendChild(cell);
    }
}

function updateAnniversaryCountdown() {
    const now = new Date();
    let next = new Date(now.getFullYear(), now.getMonth(), 18);
    if (now.getDate() >= 18) {
        next = new Date(now.getFullYear(), now.getMonth() + 1, 18);
    }
    const diffDays = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        countdownValue.textContent = "It's today! 🎉";
    } else if (diffDays === 1) {
        countdownValue.textContent = "Tomorrow! 💕";
    } else {
        countdownValue.textContent = `${diffDays} days`;
    }
}

calPrev.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
});

calNext.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
updateAnniversaryCountdown();




// ========== SCROLL PROGRESS + BACK TO TOP ==========
const scrollProgress = document.getElementById('scroll-progress');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';

    scrollTopBtn.classList.toggle('show', scrollTop > 600);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
