// ==========================================
// BURAK STUDIO - INTERACTIVE FUNCTIONALITY
// ==========================================

// ==========================================
// 1. Text Scramble Effect
// ==========================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble to headings
const initScramble = () => {
  const headings = document.querySelectorAll('.section-title, .hero-title .kinetic-text:not(.gradient-text)');
  headings.forEach(heading => {
    const fx = new TextScramble(heading);
    const originalText = heading.innerText;
    
    heading.addEventListener('mouseenter', () => fx.setText(originalText));
    
    // Initial scramble on reveal
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => fx.setText(originalText), 500);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(heading);
    }
  });
};

initScramble();

// ==========================================
// 2. Neural Network Background
// ==========================================
class NeuralNetwork {
  constructor() {
    this.canvas = document.getElementById('neuralNetwork');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    
    this.resize();
    this.init();
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    this.particles = [];
    const densityFactor = 10000; // Increased density
    const numberOfParticles = (this.canvas.width * this.canvas.height) / densityFactor;
    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 3 + 1; // Larger particles
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const directionX = (Math.random() * 1) - 0.5; // Slower, more elegant movement
      const directionY = (Math.random() * 1) - 0.5;
      const color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(34, 197, 94, 0.3)';
      this.particles.push({ 
        x, y, directionX, directionY, size, color,
        originalSize: size,
        pulse: Math.random() * Math.PI
      });
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.x += p.directionX;
      p.y += p.directionY;
      
      if (p.x > this.canvas.width || p.x < 0) p.directionX = -p.directionX;
      if (p.y > this.canvas.height || p.y < 0) p.directionY = -p.directionY;
      
      // Node Pulse
      p.pulse += 0.02;
      const currentSize = p.originalSize + Math.sin(p.pulse) * 1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      
      // Connect lines
      for (let j = i; j < this.particles.length; j++) {
        let p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) { // Increased connection distance
          this.ctx.beginPath();
          const opacity = (1 - distance/150) * 0.5;
          this.ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
      
      // Connect to mouse
      const mdx = p.x - this.mouse.x;
      const mdy = p.y - this.mouse.y;
      const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDistance < this.mouse.radius) {
        this.ctx.beginPath();
        const mOpacity = (1 - mDistance/this.mouse.radius) * 0.8;
        this.ctx.strokeStyle = `rgba(34, 197, 94, ${mOpacity})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    }
  }
}

new NeuralNetwork();

// ==========================================
// 3. Interactive Architecture Explorer
// ==========================================
const initArchExplorer = () => {
  const layers = document.querySelectorAll('.arch-layer');
  layers.forEach(layer => {
    layer.addEventListener('click', () => {
      layers.forEach(l => {
        if (l !== layer) l.classList.remove('active');
      });
      layer.classList.toggle('active');
    });
  });
  
  // Set first layer active by default
  if (layers.length > 0) {
    layers[0].classList.add('active');
  }
};

initArchExplorer();

// ==========================================
// 4. UI Soni-fication (Audio Feedback)
// ==========================================
class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = false;
    
    // Resume context on first user interaction
    const resume = () => {
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
        this.initAmbientHum();
      }
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
    };
    
    window.addEventListener('mousedown', resume, { once: true });
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('scroll', resume, { once: true });
  }

  initAmbientHum() {
    if (!this.enabled) return;
    const osc = this.context.createOscillator();
    const lfo = this.context.createOscillator();
    const gain = this.context.createGain();
    const lfoGain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, this.context.currentTime);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, this.context.currentTime);
    lfoGain.gain.setValueAtTime(5, this.context.currentTime);

    gain.gain.setValueAtTime(0.005, this.context.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    lfo.start();
  }
  
  playTick() {
    if (!this.enabled) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.02, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }
  
  playClick() {
    if (!this.enabled) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.01, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }
}

const audio = new AudioManager();

// Apply audio to interactive elements
const initAudioEvents = () => {
  const hoverables = document.querySelectorAll('.nav-link, .btn, .service-card, .portfolio-item, .arch-layer, .social-icon');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => audio.playTick());
    el.addEventListener('click', () => audio.playClick());
  });
};

initAudioEvents();

// 5. Secure Input Feedback
const initSecureInputs = () => {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => audio.playTick());
    input.addEventListener('input', debounce(() => {
      audio.playTick();
    }, 100));
  });
};

initSecureInputs();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

// 1. Scroll Progress Tracker
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (windowScroll / height) * 100;
  
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + '%';
  }
  
  if (windowScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinkElements = document.querySelectorAll('.nav-link');
navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;
  
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('active');
    }
  });
};

// Initial check
revealOnScroll();

// Check on scroll
window.addEventListener('scroll', revealOnScroll);

// Intersection Observer for better performance
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.innerText;
    
    // Secure Uplink Sequence
    submitBtn.disabled = true;
    const fx = new TextScramble(submitBtn);
    
    await fx.setText('ENCRYPTING DATA...');
    audio.playClick();
    
    await new Promise(r => setTimeout(r, 800));
    await fx.setText('ROUTING TO AGENT...');
    audio.playTick();
    
    await new Promise(r => setTimeout(r, 800));
    await fx.setText('UPLINK ESTABLISHED');
    audio.playClick();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      return;
    }
    
    // Success simulation
    showNotification('Transmission Received. Strategy Agent assigned.', 'success');
    contactForm.reset();
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }, 2000);
  });
}

// Email validation helper
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '1rem 1.5rem',
    background: type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
    border: `1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
    borderRadius: '12px',
    color: '#f8fafc',
    backdropFilter: 'blur(12px)',
    zIndex: '9999',
    animation: 'slideIn 0.3s ease',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
  });
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Parallax effect for hero blobs and geometric fragments
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const blobs = document.querySelectorAll('.blob');
  
  blobs.forEach((blob, index) => {
    const speed = 0.5 + (index * 0.2);
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });

  const fragments = document.querySelectorAll('.fragment');
  fragments.forEach((fragment, index) => {
    const speed = 0.1 + (index * 0.05);
    const rotation = scrolled * 0.1;
    const yPos = scrolled * speed;
    
    // Atmospheric Depth of Field: Dynamic blur based on scroll/speed
    const blurAmount = Math.abs(Math.sin(scrolled * 0.001 + index)) * 4;
    fragment.style.filter = `blur(${blurAmount}px)`;
    fragment.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
  });
});

// 4. Interactive Geometric Fragments
const initGeometricFragments = () => {
  const container = document.getElementById('geometricFragments');
  if (!container) return;

  const fragmentCount = 15;
  const shapes = ['circle', 'triangle', 'square'];

  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 60 + 20;
    
    fragment.className = `fragment fragment-${shape}`;
    
    Object.assign(fragment.style, {
      width: `${size}px`,
      height: `${shape === 'triangle' ? '0' : size + 'px'}`,
      top: `${Math.random() * 300}%`, // Spread across long page
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${Math.random() * 20 + 20}s`
    });

    if (shape === 'triangle') {
      fragment.style.borderLeft = `${size / 2}px solid transparent`;
      fragment.style.borderRight = `${size / 2}px solid transparent`;
      fragment.style.borderBottom = `${size}px solid rgba(255, 255, 255, 0.15)`;
    }

    container.appendChild(fragment);
  }
};

initGeometricFragments();

const createCursorGlow = () => {
  if (window.innerWidth <= 768) return;
  
  // Create wrapper for movement
  const cursorWrapper = document.createElement('div');
  cursorWrapper.className = 'cursor-wrapper';
  
  // Create inner element for glow & pulse
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  
  cursorWrapper.appendChild(cursorGlow);
  document.body.appendChild(cursorWrapper);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let activated = false;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!activated) {
      cursorX = mouseX;
      cursorY = mouseY;
      activated = true;
      cursorWrapper.classList.add('active');
    }
  });
  
  // Smooth cursor movement using requestAnimationFrame
  const animate = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    // Position the wrapper - translate3d is optimized for GPU
    cursorWrapper.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    
    requestAnimationFrame(animate);
  };
  
  animate();
};

createCursorGlow();

// 3. Magnetic & Shine Card Effects
const cards = document.querySelectorAll('.service-card, .portfolio-item, .stat-item, .info-card, .btn, .social-icon');

cards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth <= 768) return;
    
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Shine effect calculation
    const moveX = (x / rect.width) * 100;
    const moveY = (y / rect.height) * 100;
    this.style.setProperty('--mouse-x', `${moveX}%`);
    this.style.setProperty('--mouse-y', `${moveY}%`);
    
    // Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    // Magnetic pull for buttons and social icons
    if (this.classList.contains('btn') || this.classList.contains('social-icon')) {
      const strength = this.classList.contains('social-icon') ? 0.4 : 0.6;
      const magX = (x - centerX) * strength;
      const magY = (y - centerY) * strength;
      this.style.transform = `translate3d(${magX}px, ${magY}px, 0) scale(1.1)`;
    } else {
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      
      // Update border rotation for glass-panels
      if (this.classList.contains('glass-panel')) {
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        this.style.setProperty('--rotation', `${angle + 90}deg`);
      }
    }
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.setProperty('--mouse-x', `50%`);
    this.style.setProperty('--mouse-y', `50%`);
  });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
  // Any expensive scroll operations can go here
}, 10));

// Log loaded message
console.log('%c🚀 Burak Studio Website Loaded', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cDesigned for premium digital experiences', 'color: #22c55e; font-size: 14px;');
