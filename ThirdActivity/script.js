// ===================================
// VARIABLES GLOBALES
// ===================================

let currentChapter = 'cap1';
const totalChapters = 6;
let isSoundPlaying = false;

// Generador de audio sintético
let audioGen = null;
let currentAmbient = null;
let currentSounds = {};

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeAudioGenerator();
    initializeAudioPrompt();
    initializeNavigation();
    initializeSoundControl();
    initializeScrollAnimations();
    initializeRealTimeClock();
    initializeDecisionSystem();
    initializeProgressBar();
    initializeAudioButtons();
    loadUserDecision();
    
    console.log('✓ El Reloj que Devora el Tiempo - Inicializado correctamente');
});

// ===================================
// INICIALIZAR GENERADOR DE AUDIO
// ===================================

function initializeAudioGenerator() {
    audioGen = new AudioGenerator();
    console.log('✓ Audio Generator creado');
}

// ===================================
// RELOJ EN TIEMPO REAL
// ===================================

function initializeRealTimeClock() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    if (!hourHand || !minuteHand || !secondHand) return;
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const secondsDegrees = (seconds / 60) * 360;
        const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30;
        
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
        hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===================================
// NAVEGACIÓN DE CAPÍTULOS
// ===================================

function initializeNavigation() {
    // Navegación principal
    const navButtons = document.querySelectorAll('.chapter-nav .nav-link');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetChapter = button.dataset.chapter;
            switchChapter(targetChapter);
        });
    });
    
    // Botones de siguiente/anterior
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const nextChapter = button.dataset.next;
            if (nextChapter) {
                switchChapter(nextChapter);
            }
        });
    });
    
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const prevChapter = button.dataset.prev;
            if (prevChapter) {
                switchChapter(prevChapter);
            }
        });
    });
}

function switchChapter(chapterId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.story-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(chapterId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Actualizar navegación
        updateNavButtons(chapterId);
        
        // Actualizar barra de progreso
        updateProgressBar(chapterId);
        
        // Revelar imágenes con animación
        setTimeout(() => {
            revealImages(targetSection);
        }, 300);
    }
    
    currentChapter = chapterId;
}

function updateNavButtons(activeChapter) {
    const navButtons = document.querySelectorAll('.chapter-nav .nav-link');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.chapter === activeChapter) {
            button.classList.add('active');
        }
    });
}

// ===================================
// BARRA DE PROGRESO
// ===================================

function initializeProgressBar() {
    updateProgressBar(currentChapter);
}

function updateProgressBar(chapterId) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const chapterNumber = parseInt(chapterId.replace('cap', ''));
    const progress = (chapterNumber / totalChapters) * 100;
    
    progressBar.style.width = `${progress}%`;
}

// ===================================
// CONTROL DE SONIDO MEJORADO
// ===================================

function initializeSoundControl() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
}

function toggleSound() {
    const soundToggle = document.getElementById('soundToggle');
    
    if (isSoundPlaying) {
        // Detener sonido ambiente
        if (currentAmbient) {
            audioGen.fadeOut(currentAmbient, 1.0);
            currentAmbient = null;
        }
        soundToggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        soundToggle.classList.remove('playing');
        isSoundPlaying = false;
    } else {
        // Iniciar sonido ambiente
        if (!audioGen.isInitialized) {
            audioGen.initialize().then(() => {
                audioGen.generateAllSounds();
                startAmbientSound();
            });
        } else {
            startAmbientSound();
        }
        soundToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        soundToggle.classList.add('playing');
        isSoundPlaying = true;
    }
}

function startAmbientSound() {
    if (audioGen && audioGen.sounds.ambient) {
        currentAmbient = audioGen.playBuffer(audioGen.sounds.ambient, true, 0.3);
    }
}

// ===================================
// PROMPT DE AUDIO MEJORADO
// ===================================

function initializeAudioPrompt() {
    const audioPreference = localStorage.getItem('audioEnabled');
    
    if (audioPreference === null) {
        // Primera vez - mostrar modal
        const audioModal = new bootstrap.Modal(document.getElementById('audioModal'));
        audioModal.show();
    } else if (audioPreference === 'true') {
        initializeAudio();
    }
    
    const enableAudio = document.getElementById('enableAudio');
    const disableAudio = document.getElementById('disableAudio');
    
    if (enableAudio) {
        enableAudio.addEventListener('click', () => {
            localStorage.setItem('audioEnabled', 'true');
            const audioModal = bootstrap.Modal.getInstance(document.getElementById('audioModal'));
            audioModal.hide();
            initializeAudio();
        });
    }
    
    if (disableAudio) {
        disableAudio.addEventListener('click', () => {
            localStorage.setItem('audioEnabled', 'false');
            const audioModal = bootstrap.Modal.getInstance(document.getElementById('audioModal'));
            audioModal.hide();
        });
    }
}

async function initializeAudio() {
    if (!audioGen) {
        audioGen = new AudioGenerator();
    }
    
    await audioGen.initialize();
    audioGen.generateAllSounds();
    
    // Iniciar sonido ambiente automáticamente
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && audioGen.sounds.ambient) {
        currentAmbient = audioGen.playBuffer(audioGen.sounds.ambient, true, 0.3);
        soundToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        soundToggle.classList.add('playing');
        isSoundPlaying = true;
    }
    
    console.log('✓ Audio inicializado y sonidos generados');
}

// ===================================
// BOTONES DE AUDIO INTERACTIVOS
// ===================================

function initializeAudioButtons() {
    // Encontrar todos los collapses con audio
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
        const targetId = button.getAttribute('data-bs-target');
        if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.addEventListener('shown.bs.collapse', function() {
                    playContextualSound(targetId);
                });
                
                targetElement.addEventListener('hidden.bs.collapse', function() {
                    stopContextualSound(targetId);
                });
            }
        }
    });
}

function playContextualSound(targetId) {
    if (!audioGen || !audioGen.isInitialized || !audioGen.sounds) return;
    
    // Mapeo de IDs a sonidos
    const soundMap = {
        '#timeWhispers': 'whispers',
        '#enterTower': 'gears',
        '#guardianAppears': 'ticking',
        '#clockSecret': 'breaking'
    };
    
    const soundType = soundMap[targetId];
    if (soundType && audioGen.sounds[soundType]) {
        currentSounds[targetId] = audioGen.playBuffer(
            audioGen.sounds[soundType], 
            true, 
            0.4
        );
    }
}

function stopContextualSound(targetId) {
    if (currentSounds[targetId]) {
        audioGen.fadeOut(currentSounds[targetId], 0.5);
        delete currentSounds[targetId];
    }
}

// ===================================
// ANIMACIONES DE SCROLL
// ===================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);
    
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        observer.observe(container);
    });
    
    // Observer para fade-in items
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.fade-in-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = 'fadeInRight 1s ease-out forwards';
                    }, index * 500);
                });
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const fadeInSections = document.querySelectorAll('.rebirth-section, .dark-ending-section');
    fadeInSections.forEach(section => {
        fadeInObserver.observe(section);
    });
}

function revealImages(section) {
    const images = section.querySelectorAll('.image-container');
    images.forEach((img, index) => {
        setTimeout(() => {
            img.classList.add('reveal');
        }, index * 200);
    });
}

// ===================================
// SISTEMA DE DECISIÓN
// ===================================

function initializeDecisionSystem() {
    const stopBtn = document.getElementById('stopClock');
    const keepBtn = document.getElementById('keepClock');
    const changeBtn = document.getElementById('changeDecision');
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => makeDecision('stop'));
    }
    
    if (keepBtn) {
        keepBtn.addEventListener('click', () => makeDecision('keep'));
    }
    
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            localStorage.removeItem('userDecision');
            location.reload();
        });
    }
}

function makeDecision(decision) {
    localStorage.setItem('userDecision', decision);
    
    const dilemmaOptions = document.getElementById('dilemmaOptions');
    const decisionMade = document.getElementById('decisionMade');
    const decisionChoice = document.getElementById('decisionChoice');
    
    if (dilemmaOptions) dilemmaOptions.style.display = 'none';
    if (decisionMade) decisionMade.style.display = 'block';
    
    if (decisionChoice) {
        decisionChoice.textContent = decision === 'stop' ? 
            'Detener el reloj' : 
            'Mantener el reloj funcionando';
    }
    
    updateEnding(decision);
    
    // Efecto de sonido según decisión
    if (audioGen && audioGen.isInitialized) {
        if (decision === 'stop' && audioGen.sounds.breaking) {
            audioGen.playBuffer(audioGen.sounds.breaking, false, 0.6);
        } else if (decision === 'keep' && audioGen.sounds.ticking) {
            audioGen.playBuffer(audioGen.sounds.ticking, false, 0.5);
        }
    }
    
    console.log('✓ Decisión guardada:', decision);
}

function loadUserDecision() {
    const savedDecision = localStorage.getItem('userDecision');
    
    if (savedDecision) {
        const dilemmaOptions = document.getElementById('dilemmaOptions');
        const decisionMade = document.getElementById('decisionMade');
        const decisionChoice = document.getElementById('decisionChoice');
        
        if (dilemmaOptions) dilemmaOptions.style.display = 'none';
        if (decisionMade) decisionMade.style.display = 'block';
        
        if (decisionChoice) {
            decisionChoice.textContent = savedDecision === 'stop' ? 
                'Detener el reloj' : 
                'Mantener el reloj funcionando';
        }
        
        updateEnding(savedDecision);
    }
}

function updateEnding(decision) {
    const endingStop = document.getElementById('ending-stop');
    const endingKeep = document.getElementById('ending-keep');
    
    if (decision === 'stop') {
        if (endingStop) endingStop.style.display = 'block';
        if (endingKeep) endingKeep.style.display = 'none';
    } else {
        if (endingStop) endingStop.style.display = 'none';
        if (endingKeep) endingKeep.style.display = 'block';
    }
}

// ===================================
// EFECTOS ADICIONALES
// ===================================

// Efecto de paralaje suave en el fondo de engranajes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const gears = document.querySelectorAll('.gear');
    
    gears.forEach((gear, index) => {
        const speed = 0.5 + (index * 0.2);
        gear.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Mejorar interacción con botones
document.querySelectorAll('.btn-reveal, .btn-next, .btn-prev').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.cursor = 'pointer';
    });
});

// ===================================
// UTILIDADES
// ===================================

// Función para logging elegante
function log(message, type = 'info') {
    const icons = {
        info: 'ℹ️',
        success: '✓',
        error: '✗',
        warning: '⚠️'
    };
    console.log(`${icons[type]} ${message}`);
}

// Easter egg - mensaje secreto en consola
console.log('%c⏰ El Reloj que Devora el Tiempo', 'font-size: 24px; font-weight: bold; color: #e0b34a; text-shadow: 0 0 10px rgba(224, 179, 74, 0.5);');
console.log('%cCada momento cuenta. Úsalo bien.', 'font-size: 14px; color: #b7c0d8; font-style: italic;');

// Log de funcionalidades cargadas
log('Navegación de capítulos', 'success');
log('Control de audio sintético', 'success');
log('Sistema de decisión con LocalStorage', 'success');
log('Animaciones de scroll', 'success');
log('Reloj en tiempo real', 'success');
log('Barra de progreso', 'success');
log('Sistema completo inicializado', 'success');

// ===================================
// FUNCIÓN PARA DESCARGAR AUDIOS
// ===================================

// Añadir al objeto window para acceso desde consola
window.downloadAllAudio = function() {
    if (audioGen && audioGen.isInitialized) {
        audioGen.downloadAllSounds();
        console.log('📥 Descargando todos los archivos de audio...');
    } else {
        console.log('⚠️ Primero debes activar el audio');
    }
};

console.log('💡 Tip: Escribe downloadAllAudio() en la consola para descargar todos los sonidos');