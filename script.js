const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

function debounce(fn, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
}

window.addEventListener('resize', debounce(() => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}));

const SHOOTING = {
    spawnPerSecond: 0.1,
    speedMin: 450,
    speedMax: 850,
    lengthMin: 60,
    lengthMax: 160,
    angleMinDeg: 25,
    angleMaxDeg: 50,
    fadePerSecond: 1.1,
    lineWidth: 2.8,
    shadowBlur: 28,
    color: '#f0f8ff',
    glow: '#c0e0ff',

    maxStars: 12
};

class Star {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 0.85 + 0.55;
        this.vx = Math.random() * 0.11 + 0.055;
        this.vy = Math.random() * 0.18 + 0.095;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkle = Math.random() * 0.0022 + 0.0011;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.twinkle;
        if (this.x > w + 40 || this.y > h + 40 || this.x < -40 || this.y < -40) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }
    }
    draw() {
        const alpha = 0.62 + Math.sin(this.phase) * 0.35;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#f4f8ff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#b8d4ff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * w * 1.2 - w * 0.1;
        this.y = Math.random() * h * 0.35;
        this.length = Math.random() * (SHOOTING.lengthMax - SHOOTING.lengthMin) + SHOOTING.lengthMin;
        this.speed = Math.random() * (SHOOTING.speedMax - SHOOTING.speedMin) + SHOOTING.speedMin;
        this.angleDeg = Math.random() * (SHOOTING.angleMaxDeg - SHOOTING.angleMinDeg) + SHOOTING.angleMinDeg;
        this.angle = this.angleDeg * Math.PI / 180;
        this.opacity = 1;
        this.alive = true;
    }

    update(deltaSec) {
        if (!this.alive) return false;

        this.x += Math.cos(this.angle) * this.speed * deltaSec;
        this.y += Math.sin(this.angle) * this.speed * deltaSec;

        this.opacity -= SHOOTING.fadePerSecond * deltaSec;

        if (this.opacity <= 0 || this.x > w * 1.3 || this.y > h * 1.3) {
            this.alive = false;
            return false;
        }

        return true;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.opacity;
        ctx.strokeStyle = SHOOTING.color;
        ctx.lineWidth = SHOOTING.lineWidth;
        ctx.lineCap = 'round';
        ctx.shadowBlur = SHOOTING.shadowBlur;
        ctx.shadowColor = SHOOTING.glow;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length * 0.78;
        ctx.lineTo(tailX, tailY);

        ctx.stroke();
        ctx.restore();
    }
}

const stars = [];
for (let i = 0; i < 50; i++) stars.push(new Star());

const shootingStars = [];

let lastTime = 0;

function animate(currentTime = 0) {
    if (!lastTime) lastTime = currentTime;
    const deltaSec = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    if (Math.random() < SHOOTING.spawnPerSecond * deltaSec && shootingStars.length < SHOOTING.maxStars) {
        shootingStars.push(new ShootingStar());
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (s.update(deltaSec)) {
            s.draw();
        } else {
            shootingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

document.addEventListener('DOMContentLoaded', () => {
    const encoded = "aGltc2VsZkBndm96bm8uY29t";
    const target = document.getElementById('email-place');
    if (target) {
        const email = atob(encoded);
        const link = document.createElement('a');
        link.href = `mailto:${email}`;
        link.className = 'footer-email';
        link.textContent = email;
        target.appendChild(link);
    }
});
