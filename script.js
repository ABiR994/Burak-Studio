// ==========================================
// BURAK STUDIO - INTERACTIVE FUNCTIONALITY
// ==========================================

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
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Success simulation (replace with actual form submission)
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    contactForm.reset();
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
    fragment.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
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
const cards = document.querySelectorAll('.service-card, .portfolio-item, .stat-item, .info-card, .btn');

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
    
    // Magnetic pull for buttons specifically
    if (this.classList.contains('btn')) {
      const magX = (x - centerX) * 0.6;
      const magY = (y - centerY) * 0.6;
      this.style.transform = `translate3d(${magX}px, ${magY}px, 0) scale(1.05)`;
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
