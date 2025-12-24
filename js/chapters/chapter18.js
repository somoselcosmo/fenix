// js/chapters/chapter18.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter18() {
    
    // --- 1. INTELIGENCIAS MÚLTIPLES ---
    let selectedIntels = [];
    const feedback = document.getElementById('intel-feedback');
    const lock2 = document.getElementById('lock-18-2');
    const sec2 = document.getElementById('flexibility-section');

    window.toggleIntel = function(el, type) {
        el.classList.toggle('selected');
        
        if (el.classList.contains('selected')) {
            selectedIntels.push(type);
        } else {
            selectedIntels = selectedIntels.filter(i => i !== type);
        }

        if (selectedIntels.length > 0) {
            feedback.textContent = `Tienes ${selectedIntels.length} áreas de genialidad detectadas.`;
            feedback.style.color = "#22c55e";
            
            // Desbloquear fase 2 si hay al menos 1
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        } else {
            feedback.textContent = "Selecciona al menos una...";
            feedback.style.color = "#fff";
        }
    };

    // --- 2. TEST DE FLEXIBILIDAD ---
    window.calcFlexibility = function() {
        const sliders = document.querySelectorAll('.flex-slider');
        let total = 0;
        sliders.forEach(s => total += parseInt(s.value));
        
        const average = total / 4; // Max 10
        const percentage = (average / 10) * 100;
        
        const bar = document.getElementById('flex-bar');
        const text = document.getElementById('flex-score-text');
        const btn = document.getElementById('btn-confirm-flex');
        
        bar.style.width = `${percentage}%`;

        if (average < 5) {
            text.textContent = "MECÁNICA (Rígida)";
            text.style.color = "#ef4444";
            btn.classList.add('hidden');
        } else if (average < 8) {
            text.textContent = "EN PROCESO...";
            text.style.color = "#f59e0b";
            btn.classList.add('hidden');
        } else {
            text.textContent = "ADAPTABLE (Flexible)";
            text.style.color = "#22c55e";
            btn.classList.remove('hidden');
        }
    };

    window.unlockGenius = function() {
        const lock3 = document.getElementById('lock-18-3');
        const sec3 = document.getElementById('genius-section');
        
        sec3.classList.remove('locked');
        lock3.style.display = 'none';
        sec3.scrollIntoView({ behavior: 'smooth' });
    };

    // --- 3. BOMBA DE GENIO ---
    const btnPump = document.getElementById('btn-genius-pump');
    const brain = document.getElementById('brain-visual');
    const counter = document.getElementById('genius-counter');
    const finishBtn = document.getElementById('finish-chap-18');
    
    let pumps = 0;
    const TARGET_PUMPS = 10;

    if (btnPump) {
        btnPump.addEventListener('click', () => {
            pumps++;
            counter.textContent = `Repeticiones: ${pumps}/${TARGET_PUMPS}`;
            
            // Animación cerebral
            brain.classList.remove('active');
            void brain.offsetWidth; // Reflow
            brain.classList.add('active');
            
            // Cambiar color cerebro según progreso
            const hue = (pumps * 20) % 360;
            brain.style.filter = `drop-shadow(0 0 20px hsl(${hue}, 100%, 50%)) grayscale(0)`;

            if (pumps >= TARGET_PUMPS) {
                btnPump.disabled = true;
                btnPump.textContent = "GENIO DESPIERTO";
                btnPump.style.background = "#22c55e";
                brain.style.transform = "scale(1.5)";
                finishBtn.classList.remove('hidden');
            }
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 19,
                    cap18Completed: new Date(),
                    inteligencias: selectedIntels
                });
                alert("¡Poder Mental Duplicado!");
                updateSidebarProgress(19);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}