// ===================================
// GENERADOR DE AUDIO SINTÉTICO
// Web Audio API para crear sonidos ambientales
// ===================================

class AudioGenerator {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isInitialized = false;
    }

    // Inicializar el contexto de audio
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Crear contexto de audio (necesita interacción del usuario)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('✓ Audio Context inicializado');
            return true;
        } catch (error) {
            console.error('Error inicializando audio:', error);
            return false;
        }
    }

    // 1. SONIDO AMBIENTE OSCURO (Drone atmosférico)
    createAmbientSound() {
        if (!this.audioContext) return null;

        const duration = 30; // 30 segundos (se repetirá en loop)
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Oscilador bajo profundo (40-60 Hz)
                const bass = Math.sin(2 * Math.PI * 45 * t) * 0.15;
                
                // Segundo oscilador para profundidad (50-70 Hz)
                const bass2 = Math.sin(2 * Math.PI * 55 * t + Math.sin(t * 0.5)) * 0.1;
                
                // Ruido marrón filtrado para atmósfera
                const noise = (Math.random() * 2 - 1) * 0.03;
                
                // Oscilación lenta para crear movimiento
                const lfo = Math.sin(2 * Math.PI * 0.1 * t);
                
                data[i] = (bass + bass2 + noise) * (0.7 + lfo * 0.3);
            }
        }

        return buffer;
    }

    // 2. TIC-TAC DE RELOJ
    createClockTicking() {
        if (!this.audioContext) return null;

        const tickDuration = 2; 
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, tickDuration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);

        // TIC (en 0 segundos)
        for (let i = 0; i < sampleRate * 0.05; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 50);
            data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.5;
        }

        // TAC (en 1 segundo)
        const tacStart = sampleRate;
        for (let i = 0; i < sampleRate * 0.05; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 50);
            data[tacStart + i] = Math.sin(2 * Math.PI * 600 * t) * envelope * 0.5;
        }

        return buffer;
    }

    // 3. SUSURROS MISTERIOSOS
    createWhispers() {
        if (!this.audioContext) return null;

        const duration = 5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Ruido blanco filtrado
                const noise = (Math.random() * 2 - 1);
                
                // Modulación para crear efecto de susurro
                const modulation = Math.sin(2 * Math.PI * 2 * t) * 0.5 + 0.5;
                
                // Envelope para fade in/out
                const envelope = Math.sin(Math.PI * t / duration);
                
                data[i] = noise * modulation * envelope * 0.15;
            }
        }

        return buffer;
    }

    // 4. ENGRANAJES MECÁNICOS
    createGearSound() {
        if (!this.audioContext) return null;

        const duration = 10;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Frecuencias metálicas
                const gear1 = Math.sin(2 * Math.PI * 120 * t) * 0.1;
                const gear2 = Math.sin(2 * Math.PI * 180 * t + Math.sin(t * 2)) * 0.08;
                
                // Ruido para fricción
                const friction = (Math.random() * 2 - 1) * 0.05;
                
                // Modulación de amplitud para simular rotación
                const rotation = Math.abs(Math.sin(2 * Math.PI * 0.5 * t));
                
                data[i] = (gear1 + gear2 + friction) * rotation;
            }
        }

        return buffer;
    }

    // 5. CAMPANADAS FINALES
    createBellSound() {
        if (!this.audioContext) return null;

        const duration = 8;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            
            // Tres campanadas
            const bellTimes = [0, 2, 4];
            
            for (let bell of bellTimes) {
                const startSample = bell * sampleRate;
                
                for (let i = 0; i < sampleRate * 2; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 1.5);
                    
                    // Frecuencias armónicas de campana
                    const fundamental = Math.sin(2 * Math.PI * 440 * t);
                    const harmonic2 = Math.sin(2 * Math.PI * 880 * t) * 0.5;
                    const harmonic3 = Math.sin(2 * Math.PI * 1320 * t) * 0.3;
                    
                    if (startSample + i < buffer.length) {
                        data[startSample + i] += (fundamental + harmonic2 + harmonic3) * envelope * 0.3;
                    }
                }
            }
        }

        return buffer;
    }

    // 6. ROMPER RELOJ (Efecto dramático)
    createBreakingSound() {
        if (!this.audioContext) return null;

        const duration = 3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Crash inicial
                if (t < 0.5) {
                    const noise = (Math.random() * 2 - 1);
                    const envelope = Math.exp(-t * 10);
                    data[i] = noise * envelope * 0.7;
                }
                
                // Resonancia metálica
                if (t > 0.3 && t < 2.5) {
                    const metallic = Math.sin(2 * Math.PI * 300 * t * (1 + Math.random() * 0.1));
                    const envelope = Math.exp(-(t - 0.3) * 3);
                    data[i] += metallic * envelope * 0.4;
                }
            }
        }

        return buffer;
    }

    // Reproducir un buffer de audio
    playBuffer(buffer, loop = false, volume = 1.0) {
        if (!this.audioContext || !buffer) return null;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = loop;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
        
        return { source, gainNode };
    }

    // Detener una fuente de audio
    stopSound(soundObject) {
        if (soundObject && soundObject.source) {
            soundObject.source.stop();
        }
    }

    // Fade out
    fadeOut(soundObject, duration = 1.0) {
        if (soundObject && soundObject.gainNode) {
            const currentTime = this.audioContext.currentTime;
            soundObject.gainNode.gain.setValueAtTime(soundObject.gainNode.gain.value, currentTime);
            soundObject.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
            
            setTimeout(() => {
                if (soundObject.source) {
                    soundObject.source.stop();
                }
            }, duration * 1000);
        }
    }

    // Crear todos los buffers de audio
    generateAllSounds() {
        if (!this.audioContext) {
            console.error('Audio context no inicializado');
            return;
        }

        console.log('🎵 Generando sonidos sintéticos...');
        
        this.sounds.ambient = this.createAmbientSound();
        this.sounds.ticking = this.createClockTicking();
        this.sounds.whispers = this.createWhispers();
        this.sounds.gears = this.createGearSound();
        this.sounds.bell = this.createBellSound();
        this.sounds.breaking = this.createBreakingSound();
        
        console.log('✓ Todos los sonidos generados');
    }

    // Exportar audio a WAV (para descargar)
    bufferToWave(buffer, offset, length) {
        const numOfChan = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numOfChan * bytesPerSample;
        
        const data = new Float32Array(length * numOfChan);
        
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            const channel = buffer.getChannelData(i);
            for (let j = 0; j < length; j++) {
                data[j * numOfChan + i] = channel[offset + j];
            }
        }
        
        const dataLength = data.length * bytesPerSample;
        const buffer32 = new ArrayBuffer(44 + dataLength);
        const view = new DataView(buffer32);
        
        // RIFF chunk descriptor
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        this.writeString(view, 8, 'WAVE');
        
        // FMT sub-chunk
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numOfChan, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        
        // Data sub-chunk
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true);
        
        // Write PCM samples
        let offset32 = 44;
        for (let i = 0; i < data.length; i++) {
            const sample = Math.max(-1, Math.min(1, data[i]));
            view.setInt16(offset32, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset32 += 2;
        }
        
        return buffer32;
    }
    
    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    
    // Descargar un audio como archivo WAV
    downloadSound(soundName, buffer) {
        const wav = this.bufferToWave(buffer, 0, buffer.length);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${soundName}.wav`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // Descargar todos los sonidos
    downloadAllSounds() {
        console.log('📥 Descargando todos los sonidos...');
        
        Object.keys(this.sounds).forEach(key => {
            if (this.sounds[key]) {
                setTimeout(() => {
                    this.downloadSound(key, this.sounds[key]);
                }, 500);
            }
        });
    }
}

// Exportar para uso global
window.AudioGenerator = AudioGenerator;