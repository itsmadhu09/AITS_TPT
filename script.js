// 1. Initialize Lucide Icons
lucide.createIcons();

// 2. THE MAIN EVENT: Interactive Particle Background Logic
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Structure to hold mouse data
let mouse = { x: null, y: null, radius: 100 }; // Interaction radius

// Set canvas size to full window
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

// Adjust size on window resize (Senior Standard)
window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles(); // Re-initialize particles for new size
});

// Track Mouse Movement
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Remove interaction when mouse leaves
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});


// Particle Class Definition
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#6366f1'; // primary color
        ctx.fill();
    }

    // Update particle position and handle interactions
    update() {
        // Core Movement Logic
        this.x += this.directionX;
        this.y += this.directionY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Mouse Interaction Logic (The "Interactive" part)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            // If particle is within mouse radius, push it away gently
            if (distance < mouse.radius) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
            }
        }
        this.draw();
    }
}

let particlesArray = [];

// Initialize particle system
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; // Density
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; // 1-3px size
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25; // Slower, elegant speed
        let directionY = (Math.random() * 0.5) - 0.25;
        let color = '#6366f1';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Check distance between particles and draw connecting lines (The Neural Net effect)
function connectParticles() {
    let opacity = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            // If close enough, draw a faint line
            if (distance < (canvas.width/7)) {
                opacity = 1 - (distance/150);
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`; // primary color line
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop (Standard high-perf loop)
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight); // Clear previous frame
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

initParticles();
animateParticles();


// 3. Counter Animation Logic (Untouched, still effective)
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounter = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + (target === 95 ? "%" : "+");
            }
        };
        updateCount();
    });
};

// Intersection Observer for cleaner scroll-trigger (Senior approach)
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        startCounter();
        observer.disconnect(); // Only run once
    }
}, { threshold: 0.5 }); // Trigger when 50% visible

observer.observe(document.getElementById('stats'));

// 4. AI Assistant Interaction
const aiBot = document.getElementById('ai-assistant');
aiBot.addEventListener('click', () => {
    alert("Initiating AITS AI Concierge... Our virtual assistant will guide you through admissions.");
});
