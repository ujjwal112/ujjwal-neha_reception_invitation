/**
 * LUXURY RECEPTION INVITATION - CLIENT SIDE SCRIPT
 * Handles Canvas Particles, 3D Tilt/Reflection Effect, Countdown Timer,
 * Lightbox Gallery, RSVP validation, and Background Music Player.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. FLOATING PARTICLES ENGINE (CANVAS)
    // ==========================================================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 45;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.reset(true);
        }
        
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? (Math.random() * canvas.height) : (canvas.height + 20);
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1; // slow drift upwards
            this.speedX = (Math.random() - 0.5) * 0.25; // slight horizontal drift
            this.alpha = Math.random() * 0.5 + 0.15;
            this.alphaOscillateSpeed = Math.random() * 0.01 + 0.005;
            this.hue = 45; // Golden hue
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            // Shimmer/twinkle effect
            this.alpha += Math.sin(Date.now() * this.alphaOscillateSpeed) * 0.015;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > 0.7) this.alpha = 0.7;
            
            // Reset particle when it goes off screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(252, 225, 173, ${this.alpha})`;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for performance
        }
    }
    
    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();

    // ==========================================================================
    // 2. LUXURY CARD REFLECTION / TILT EFFECT
    // ==========================================================================
    const glassCards = document.querySelectorAll('.glass-card, .glass-footer');
    
    glassCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the card
            const y = e.clientY - rect.top;  // y coordinate inside the card
            
            // Set variables for mouse position
            const percentX = (x / rect.width - 0.5) * 12; // max tilt angle X
            const percentY = (y / rect.height - 0.5) * -12; // max tilt angle Y
            
            card.style.transform = `perspective(1000px) rotateY(${percentX}deg) rotateX(${percentY}deg) translateY(-5px)`;
            
            // Position the gradient gloss glow highlight
            if (glow) {
                glow.style.transform = `translate(${x - rect.width}px, ${y - rect.height}px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            if (glow) {
                glow.style.transform = 'translate(-50%, -50%)';
            }
        });
    });

    // ==========================================================================
    // 3. COUNTDOWN TIMER (5 DECEMBER 2026, 6:00 PM IST)
    // ==========================================================================
    // 5th Dec 2026 at 18:00 (IST is UTC+05:30)
    const targetDate = new Date('2026-12-05T18:00:00+05:30').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            document.querySelector('.countdown-container').innerHTML = `
                <div class="celebration-started-msg">
                    <p class="celebrating-text">The Celebration has Begun!</p>
                </div>
            `;
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Format with leading zeros
        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately

    // ==========================================================================
    // 4. COPY ADDRESS TO CLIPBOARD
    // ==========================================================================
    const copyBtn = document.getElementById('copyAddressBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const addressText = "Signature Farm, Sonia Vihar, Delhi 110090";
            navigator.clipboard.writeText(addressText).then(() => {
                const btnText = copyBtn.querySelector('span');
                btnText.textContent = "Address Copied! ✓";
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    btnText.textContent = "Copy Address";
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy address: ', err);
            });
        });
    }

    // ==========================================================================
    // 5. COPY CONTACT NUMBER TO CLIPBOARD
    // ==========================================================================
    const copyNumBtns = document.querySelectorAll('.copy-num-btn');
    const toast = document.getElementById('toastNotification');
    const toastMsg = toast ? toast.querySelector('.toast-message') : null;
    let toastTimeout;

    copyNumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const phone = btn.getAttribute('data-phone');
            const name = btn.getAttribute('data-name');
            
            navigator.clipboard.writeText(phone).then(() => {
                if (toast && toastMsg) {
                    toastMsg.textContent = `${name}'s number copied to clipboard! ✓`;
                    toast.classList.add('show');
                    
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                }
            }).catch(err => {
                console.error('Failed to copy phone number: ', err);
            });
        });
    });

    // ==========================================================================
    // 6. SCROLL TO TOP BUTTON
    // ==========================================================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 7. 3D ENVELOPE OPENING ANIMATION
    // ==========================================================================
    const waxSeal = document.getElementById('waxSeal');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    
    if (waxSeal && envelopeWrapper) {
        waxSeal.addEventListener('click', () => {
            // Step 1: Wax seal fades out
            envelopeWrapper.classList.add('open-step-1');
            
            // Step 2: Flap folds open after a brief delay
            setTimeout(() => {
                envelopeWrapper.classList.add('open-step-2');
            }, 300);
            
            // Step 3: Zoom and fade-out entire envelope to reveal invitation
            setTimeout(() => {
                envelopeWrapper.classList.add('open');
                document.body.classList.remove('no-scroll');
            }, 2000);
            
            // Step 4: Remove envelope element from DOM flow
            setTimeout(() => {
                envelopeWrapper.style.display = 'none';
            }, 3200);
        });
    }
});
