// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Active Navigation Link
document.addEventListener('DOMContentLoaded', () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentPage = pathParts[pathParts.length - 1] || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    initBackgroundAudio();
});

const AUDIO_STORAGE_KEY = 'portfolioAudioMuted';
const AUDIO_VOLUME = 0.05;
const AUDIO_ICON_SOUND_ON = '🔊';
const AUDIO_ICON_MUTED = '🔇';

function initBackgroundAudio() {
    const audioButton = document.createElement('button');
    audioButton.className = 'audio-control';
    audioButton.type = 'button';
    audioButton.setAttribute('aria-label', 'Mute achtergrondmuziek');
    audioButton.innerHTML = `<span class="audio-icon">${AUDIO_ICON_SOUND_ON}</span>`;
    document.body.appendChild(audioButton);

    const AUDIO_TIME_STORAGE_KEY = 'portfolioAudioTime';
    const storedMuted = localStorage.getItem(AUDIO_STORAGE_KEY);
    let isMuted = storedMuted === 'true';

    const audio = new Audio('audio/AvantiMindwave.mp3');
    audio.loop = true;
    audio.volume = AUDIO_VOLUME;
    audio.muted = isMuted;
    audio.preload = 'auto';
    audio.setAttribute('aria-hidden', 'true');
    audio.style.display = 'none';
    document.body.appendChild(audio);

    const storedTime = parseFloat(localStorage.getItem(AUDIO_TIME_STORAGE_KEY));
    if (!Number.isNaN(storedTime) && storedTime >= 0) {
        audio.currentTime = storedTime;
    }

    function updateAudioButton() {
        const icon = isMuted ? AUDIO_ICON_MUTED : AUDIO_ICON_SOUND_ON;
        audioButton.innerHTML = `<span class="audio-icon">${icon}</span>`;
        audioButton.classList.toggle('muted', isMuted);
        audioButton.setAttribute('aria-label', isMuted ? 'Geluid aanzetten' : 'Geluid dempen');
    }

    function resumeAudio() {
        audio.play().catch(() => {
            // Autoplay mag geblokkeerd zijn tot gebruikerinteractie plaatsvindt.
        });
    }

    audioButton.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        localStorage.setItem(AUDIO_STORAGE_KEY, String(isMuted));
        updateAudioButton();
        resumeAudio();
    });

    const saveAudioTime = () => {
        if (!audio.paused && !audio.error) {
            localStorage.setItem(AUDIO_TIME_STORAGE_KEY, String(audio.currentTime));
        }
    };

    window.addEventListener('beforeunload', saveAudioTime);
    const audioTimeInterval = setInterval(saveAudioTime, 1000);

    audio.addEventListener('ended', saveAudioTime);
    audio.addEventListener('pause', saveAudioTime);

    updateAudioButton();
    resumeAudio();
}

// Filter Projects
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-detailed');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    project.style.display = 'grid';
                    setTimeout(() => {
                        project.style.opacity = '1';
                    }, 10);
                } else {
                    project.style.opacity = '0';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button and change color to green
        submitBtn.disabled = true;
        submitBtn.style.background = '#10b981';
        submitBtn.textContent = 'Verstuur';
        
        try {
            // Send form data using FormSubmit.co
            const formData = new FormData(contactForm);
            
            const response = await fetch('https://formsubmit.co/jopvanoosten@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            // Show success message
            showMessage('Bedankt voor je bericht! Ik zal hem zo snel mogelijk proberen te lezen.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Keep button disabled and green for visual feedback
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(135deg, #2563eb, #1e1e1e)';
                submitBtn.textContent = 'Verstuur';
            }, 3000);
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Er is iets fout gegaan. Probeer alstublieft opnieuw.', 'error');
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #2563eb, #1e1e1e)';
        }
    });
}

function showMessage(text, type) {
    if (formMessage) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and skill items
document.querySelectorAll('.project-card, .skill, .education-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Add scroll-to-top button functionality
const scrollTopButton = document.createElement('button');
scrollTopButton.innerHTML = '↑';
scrollTopButton.className = 'scroll-top-btn';
scrollTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #2563eb, #1e1e1e);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
`;

document.body.appendChild(scrollTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopButton.style.opacity = '1';
        scrollTopButton.style.visibility = 'visible';
    } else {
        scrollTopButton.style.opacity = '0';
        scrollTopButton.style.visibility = 'hidden';
    }
});

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopButton.addEventListener('mouseenter', () => {
    scrollTopButton.style.transform = 'scale(1.1)';
});

scrollTopButton.addEventListener('mouseleave', () => {
    scrollTopButton.style.transform = 'scale(1)';
});

// Active link update on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    // Check if we're at the top
    if (window.pageYOffset < 100) {
        current = 'top';
    }

    // Update the navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const currentPage = pathParts[pathParts.length - 1] || 'index.html';
        
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
