// ===================================
// VARIABLES GLOBALES
// ===================================

let currentChapter = 'inicio';
const ambientSound = document.getElementById('ambientSound');
const soundToggle = document.getElementById('soundToggle');
let isSoundPlaying = false;

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeAudioPrompt();
    initializeNavigation();
    initializeSoundControl();
    initializeRevealButtons();
    initializeScrollAnimations();
    fadeInItems();
    initializeRealTimeClock();
    initializeInteractiveLever();
    initializeDecisionSystem();
    loadUserDecision();
});

// ===================================
// RELOJ EN TIEMPO REAL
// ===================================

function initializeRealTimeClock() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    if (!hourHand || !minuteHand || !secondHand) {
        console.log('Clock elements not found');
        return;
    }
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Calculate rotation degrees
        const secondsDegrees = (seconds / 60) * 360;
        const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30;
        
        // Apply rotation
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
        hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }
    
    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    console.log('Real-time clock initialized');
}

// ===================================
// NAVEGACIÓN DE CAPÍTULOS
// ===================================

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetChapter = e.target.dataset.chapter;
            switchChapter(targetChapter);
        });
    });
    
    // Establecer el primer capítulo como activo
    document.querySelector('.nav-btn[data-chapter="inicio"]').classList.add('active');
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
        
        // Scroll suave al inicio de la sección
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Actualizar botones de navegación
        updateNavButtons(chapterId);
        
        // Revelar imágenes con animación
        setTimeout(() => {
            revealImages(targetSection);
        }, 300);
    }
    
    currentChapter = chapterId;
}

function updateNavButtons(activeChapter) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.chapter === activeChapter) {
            button.classList.add('active');
        }
    });
}

// ===================================
// CONTROL DE SONIDO AMBIENTE
// ===================================

function initializeSoundControl() {
    soundToggle.addEventListener('click', () => {
        toggleSound();
    });
}

function toggleSound() {
    if (isSoundPlaying) {
        ambientSound.pause();
        soundToggle.classList.remove('playing');
        soundToggle.querySelector('.sound-icon').textContent = '🔇';
        isSoundPlaying = false;
    } else {
        ambientSound.play().catch(error => {
            console.log('Error al reproducir audio:', error);
        });
        soundToggle.classList.add('playing');
        soundToggle.querySelector('.sound-icon').textContent = '🔊';
        isSoundPlaying = true;
    }
}

// ===================================
// BOTONES DE REVELACIÓN
// ===================================

function initializeRevealButtons() {
    const revealButtons = document.querySelectorAll('.reveal-btn');
    
    revealButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = button.dataset.target;
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                // Toggle visibilidad con animación
                if (targetContent.classList.contains('visible')) {
                    targetContent.classList.remove('visible');
                } else {
                    targetContent.classList.add('visible');
                    
                    // Aplicar efectos especiales según el contenido
                    applySpecialEffects(targetId, targetContent);
                }
            }
        });
    });
}

function applySpecialEffects(targetId, element) {
    // Efectos especiales para momentos clave de la historia
    switch(targetId) {
        case 'time-whispers':
        case 'secret1':
            // Efecto de susurro
            element.style.animation = 'whisperGlow 3s ease-in-out infinite';
            // Intentar reproducir audio automáticamente
            const whisperAudio = element.querySelector('audio');
            if (whisperAudio) {
                whisperAudio.play().catch(error => {
                    console.log('Autoplay bloqueado, usuario debe interactuar primero');
                });
            }
            break;
            
        case 'enter-tower':
            // Cambiar escena a modo oscuro/rojo
            const sceneBox = document.querySelector('.scene-change');
            if (sceneBox) {
                sceneBox.classList.add('dark-mode');
            }
            // Cambiar fondo del body
            document.body.style.background = 'linear-gradient(135deg, #0f0f14 0%, #1a0000 100%)';
            document.body.style.transition = 'background 1.5s ease';
            
            // Reproducir audio de engranajes
            const towerAudio = element.querySelector('audio');
            if (towerAudio) {
                towerAudio.play().catch(error => {
                    console.log('Autoplay bloqueado:', error);
                });
            }
            break;
            
        case 'tower-video':
            // Reproducir video automáticamente si existe
            const towerVideo = element.querySelector('video');
            if (towerVideo) {
                towerVideo.play().catch(error => console.log('Error reproduciendo video:', error));
            }
            break;
            
        case 'guardian-appears':
        case 'guardian':
            // Efecto de aparición del guardián
            element.style.animation = 'fadeIn 2s ease-out';
            // Reproducir audio misterioso
            const guardianAudio = element.querySelector('audio');
            if (guardianAudio) {
                guardianAudio.play().catch(error => {
                    console.log('Autoplay bloqueado:', error);
                });
            }
            break;
            
        case 'clock-secret':
            // Revelación dramática del secreto
            element.style.animation = 'pulseGlow 2s ease-in-out infinite';
            break;
            
        case 'pull-lever':
        case 'finalMoment':
            // Efecto dramático del momento final
            document.body.style.animation = 'shake 0.5s ease-in-out 3';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 1500);
            
            // Reproducir audio climático
            const climaxAudio = element.querySelector('audio');
            if (climaxAudio) {
                climaxAudio.play().catch(error => {
                    console.log('Autoplay bloqueado:', error);
                });
            }
            break;
            
        case 'new-beginning':
        case 'ending-music':
            // Reproducir música final
            const audio = element.querySelector('audio');
            if (audio) {
                audio.play().catch(error => {
                    console.log('Autoplay bloqueado:', error);
                });
            }
            // Restaurar fondo original
            setTimeout(() => {
                document.body.style.background = 'linear-gradient(135deg, #0f0f14 0%, #1f2633 100%)';
            }, 2000);
            break;
            
        case 'clock-sound':
            // Reproducir sonido del reloj
            const clockAudio = element.querySelector('audio');
            if (clockAudio) {
                clockAudio.play().catch(error => {
                    console.log('Autoplay bloqueado:', error);
                });
            }
            break;
    }
}

// ===================================
// ANIMACIONES DE SCROLL
// ===================================

function initializeScrollAnimations() {
    // Observer para animaciones al hacer scroll
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
    
    // Observar todos los contenedores de imágenes
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        observer.observe(container);
    });
}

function revealImages(section) {
    // Revelar imágenes en la sección activa
    const images = section.querySelectorAll('.image-container');
    images.forEach((img, index) => {
        setTimeout(() => {
            img.classList.add('reveal');
        }, index * 200);
    });
}

// ===================================
// ANIMACIÓN DE FADE-IN PARA ITEMS
// ===================================

function fadeInItems() {
    // Animar elementos de la lista de renacimiento cuando sean visibles
    const rebirthObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.fade-in-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = `fadeInRight 1s ease-out forwards`;
                    }, index * 500);
                });
                rebirthObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const rebirthSection = document.querySelector('.rebirth-section');
    if (rebirthSection) {
        rebirthObserver.observe(rebirthSection);
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

// Efecto de cursor personalizado para botones
document.querySelectorAll('.reveal-btn, .nav-btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });
    
    button.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});

// Efecto de sonido tick-tock al pasar sobre relojes
const clockElements = document.querySelectorAll('.clock-icon, .tick-tock');
clockElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        // Pequeña animación al pasar el cursor
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
});

// ===================================
// FUNCIONES DE UTILIDAD
// ===================================

// Prevenir que los videos/audios se reproduzcan todos a la vez
document.querySelectorAll('video, audio').forEach(media => {
    media.addEventListener('play', () => {
        // Pausar otros medios cuando uno empiece a reproducirse
        document.querySelectorAll('video, audio').forEach(otherMedia => {
            if (otherMedia !== media && otherMedia !== ambientSound) {
                otherMedia.pause();
            }
        });
    });
});

// Animación de la palanca al hacer hover
const enterTowerBtn = document.getElementById('enterTowerBtn');
if (enterTowerBtn) {
    enterTowerBtn.addEventListener('mouseenter', () => {
        enterTowerBtn.style.animation = 'pulse 1s ease-in-out infinite';
    });
    
    enterTowerBtn.addEventListener('mouseleave', () => {
        enterTowerBtn.style.animation = '';
    });
}

// ===================================
// PALANCA INTERACTIVA
// ===================================

function initializeInteractiveLever() {
    const leverArm = document.getElementById('leverArm');
    const leverButton = document.getElementById('leverButton');
    
    if (leverArm) {
        leverArm.addEventListener('click', () => {
            leverArm.classList.toggle('pulled');
            
            if (leverArm.classList.contains('pulled')) {
                // Efecto dramático al bajar la palanca
                setTimeout(() => {
                    document.body.style.animation = 'shake 0.5s ease-in-out 3';
                }, 300);
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 1800);
                
                // Auto-click en el botón después de bajar la palanca
                setTimeout(() => {
                    if (leverButton) {
                        leverButton.click();
                    }
                }, 1000);
            }
        });
    }
}

// ===================================
// PROMPT INICIAL DE AUDIO
// ===================================

function initializeAudioPrompt() {
    const audioPrompt = document.getElementById('audioPrompt');
    const enableAudio = document.getElementById('enableAudio');
    const disableAudio = document.getElementById('disableAudio');
    
    // Verificar si el usuario ya hizo una elección
    const audioPreference = localStorage.getItem('audioEnabled');
    
    if (audioPreference === null) {
        // Primera vez - mostrar prompt
        if (audioPrompt) {
            audioPrompt.style.display = 'flex';
        }
    } else {
        // Ya hay preferencia guardada
        if (audioPrompt) {
            audioPrompt.style.display = 'none';
        }
        if (audioPreference === 'true') {
            enableAllAudio();
        }
    }
    
    if (enableAudio) {
        enableAudio.addEventListener('click', () => {
            localStorage.setItem('audioEnabled', 'true');
            audioPrompt.style.display = 'none';
            enableAllAudio();
            // Iniciar audio ambiente
            if (ambientSound) {
                ambientSound.play().catch(e => console.log('Audio error:', e));
                soundToggle.classList.add('playing');
                soundToggle.querySelector('.sound-icon').textContent = '🔊';
                isSoundPlaying = true;
            }
        });
    }
    
    if (disableAudio) {
        disableAudio.addEventListener('click', () => {
            localStorage.setItem('audioEnabled', 'false');
            audioPrompt.style.display = 'none';
        });
    }
}

function enableAllAudio() {
    // Marcar que el audio está habilitado
    window.audioEnabled = true;
    console.log('Audio habilitado globalmente');
}

// ===================================
// SISTEMA DE DECISIÓN CON LOCALSTORAGE
// ===================================

function initializeDecisionSystem() {
    const stopBtn = document.getElementById('stopClock');
    const keepBtn = document.getElementById('keepClock');
    const changeBtn = document.getElementById('changeDecision');
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            makeDecision('stop');
        });
    }
    
    if (keepBtn) {
        keepBtn.addEventListener('click', () => {
            makeDecision('keep');
        });
    }
    
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            localStorage.removeItem('userDecision');
            location.reload();
        });
    }
}

function makeDecision(decision) {
    // Guardar decisión en localStorage
    localStorage.setItem('userDecision', decision);
    
    // Mostrar resultado
    const decisionBox = document.getElementById('decisionBox');
    const decisionMade = document.getElementById('decisionMade');
    const decisionChoice = document.getElementById('decisionChoice');
    const dilemma = decisionBox.querySelector('.dilemma');
    
    if (dilemma) dilemma.style.display = 'none';
    if (decisionMade) decisionMade.style.display = 'block';
    
    if (decisionChoice) {
        if (decision === 'stop') {
            decisionChoice.textContent = 'Detener el reloj';
        } else {
            decisionChoice.textContent = 'Mantener el reloj funcionando';
        }
    }
    
    // Actualizar el final mostrado
    updateEnding(decision);
    
    console.log('Decisión guardada:', decision);
}

function loadUserDecision() {
    const savedDecision = localStorage.getItem('userDecision');
    
    if (savedDecision) {
        // Ya hay una decisión guardada
        const decisionBox = document.getElementById('decisionBox');
        const decisionMade = document.getElementById('decisionMade');
        const decisionChoice = document.getElementById('decisionChoice');
        const dilemma = decisionBox ? decisionBox.querySelector('.dilemma') : null;
        
        if (dilemma) dilemma.style.display = 'none';
        if (decisionMade) decisionMade.style.display = 'block';
        
        if (decisionChoice) {
            if (savedDecision === 'stop') {
                decisionChoice.textContent = 'Detener el reloj';
            } else {
                decisionChoice.textContent = 'Mantener el reloj funcionando';
            }
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

// Log de eventos para debugging
console.log('El Reloj que Devora el Tiempo - Página web narrativa cargada');
console.log('Funcionalidades: Navegación de capítulos, Control de audio, Revelaciones interactivas, Cambio de escena');
console.log('Elementos CSS: Reloj en tiempo real, Engranajes animados, Linterna, Palanca interactiva');
console.log('Animaciones SVG: Engranajes, Guardián, Reloj rompiéndose');
console.log('Sistema de decisión: Dos finales alternativos guardados en localStorage');

// ===================================
// GESTIÓN MEJORADA DE AUTOPLAY
// ===================================

// Mejorar reproducción de audio cuando se revela contenido
document.addEventListener('click', function enableAudioOnInteraction() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        // Intentar reproducir y pausar para "despertar" el audio
        audio.play().then(() => {
            if (!audio.hasAttribute('autoplay') || audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        }).catch(() => {
            // Silenciosamente ignorar errores
        });
    });
    // Solo ejecutar una vez
    document.removeEventListener('click', enableAudioOnInteraction);
}, { once: true });