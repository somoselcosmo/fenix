// js/chapters/chapter13.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter13() {
    
    // --- 1. SINTONIZADOR DE ONDAS ---
    const slider = document.getElementById('wave-slider');
    const visualizer = document.getElementById('wave-canvas');
    const nameEl = document.getElementById('wave-name');
    const descEl = document.getElementById('wave-desc');
    const infoBox = document.getElementById('wave-info');
    
    const lock2 = document.getElementById('lock-13-2');
    const sec2 = document.getElementById('lazonov-section');

    const waves = {
        4: { class: 'beta', name: 'Beta (14-29 Hz)', desc: 'Estrés, alerta, poca retención. Ineficiente.' },
        3: { class: 'alfa', name: 'Alfa (8-13 Hz)', desc: 'Relajación, Super Aprendizaje. El estado ideal.' },
        2: { class: 'theta', name: 'Theta (5-7 Hz)', desc: 'Creatividad profunda, sueño ligero. Memoria fotográfica.' },
        1: { class: 'delta', name: 'Delta (1-4 Hz)', desc: 'Sueño profundo. Inconsciencia.' }
    };

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            const wave = waves[val];

            // Actualizar UI
            visualizer.className = `wave-visualizer ${wave.class}`;
            nameEl.textContent = wave.name;
            descEl.textContent = wave.desc;
            
            // Si llega a Alfa, desbloqueamos lo siguiente
            if (val == 3) {
                infoBox.classList.add('active');
                if(sec2.classList.contains('locked')) {
                    setTimeout(() => {
                        sec2.classList.remove('locked');
                        lock2.style.display = 'none';
                        sec2.scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                }
            } else {
                infoBox.classList.remove('active');
            }
        });
        
        // Iniciar en Beta
        visualizer.classList.add('beta');
    }

    // --- 2. EXPERIMENTO LAZONOV ---
    const btnMusic = document.getElementById('btn-play-music');
    const memBox = document.getElementById('memory-test');
    const wordEl = document.getElementById('word-flash');
    const lock3 = document.getElementById('lock-13-3');
    const sec3 = document.getElementById('routine-section');

    const words = ["ARMONÍA", "RETENCIÓN", "SINCRONÍA", "POTENCIAL", "ÉXITO"];
    let wordIndex = 0;

    if (btnMusic) {
        btnMusic.addEventListener('click', () => {
            btnMusic.disabled = true;
            btnMusic.textContent = "🎵 MÚSICA BARROCA ACTIVADA...";
            
            memBox.classList.remove('hidden');
            
            // Simular ciclo de palabras
            const interval = setInterval(() => {
                if (wordIndex >= words.length) {
                    clearInterval(interval);
                    wordEl.textContent = "¡APRENDIZAJE COMPLETADO!";
                    
                    setTimeout(() => {
                        sec3.classList.remove('locked');
                        lock3.style.display = 'none';
                        sec3.scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                    return;
                }
                wordEl.textContent = words[wordIndex];
                wordIndex++;
            }, 2000); // 2 segundos por palabra (Ritmo lento)
        });
    }

    // --- 3. GENERADOR DE PLAN ---
    const btnPlan = document.getElementById('btn-generate-plan');
    const inputTopic = document.getElementById('learn-topic');
    const checkDesire = document.getElementById('check-desire');
    const planBox = document.getElementById('study-plan');
    const finishBtn = document.getElementById('finish-chap-13');

    if (btnPlan) {
        btnPlan.addEventListener('click', () => {
            if (inputTopic.value.length < 2) return alert("Escribe qué quieres aprender.");
            if (!checkDesire.checked) return alert("Sin deseo intenso, no hay aprendizaje.");

            planBox.classList.remove('hidden');
            finishBtn.classList.remove('hidden');
            
            // Scroll final
            finishBtn.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 14,
                    cap13Completed: new Date(),
                    metaAprendizaje: inputTopic.value
                });
                alert("¡Modo Super Aprendizaje Activado!");
                updateSidebarProgress(14);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}