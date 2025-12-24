// js/chapters/chapter11.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter11() {
    
    // --- 1. DIETA MENTAL (Menú) ---
    let dietScore = 0;
    const dietFeedback = document.getElementById('diet-feedback');
    const lock2 = document.getElementById('lock-11-2');
    const sec2 = document.getElementById('audio-section');

    window.consumeDiet = function(type) {
        if (type === 'toxic') {
            dietFeedback.textContent = "⚠️ ALERTA: Virus mental detectado. Cortisol subiendo.";
            dietFeedback.style.color = "#ef4444";
            dietScore--;
        } else {
            dietFeedback.textContent = "✅ NUTRIDO: Dopamina y conocimiento absorbidos.";
            dietFeedback.style.color = "#22c55e";
            dietScore++;
        }

        // Si elige 2 cosas sanas, avanza
        if (dietScore >= 2) {
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    };

    // --- 2. CALCULADORA UNIVERSIDAD ---
    const slider = document.getElementById('commute-slider');
    const valDisplay = document.getElementById('commute-val');
    const resultDisplay = document.getElementById('university-result');
    const lock3 = document.getElementById('lock-11-3');
    const sec3 = document.getElementById('network-section');

    if (slider) {
        slider.addEventListener('input', (e) => {
            const hours = parseFloat(e.target.value);
            valDisplay.textContent = hours;
            
            // Fórmula: 1 hora diaria ~= 1 semestre universitario al año (según Tracy)
            // En 10 años: horas * 10
            const semesters = Math.floor(hours * 10); 
            const phd = Math.floor(hours * 2); // Equivalencia a doctorados
            
            if (hours === 0) {
                resultDisplay.textContent = "0 Conocimiento Extra";
            } else {
                resultDisplay.textContent = `${semesters} Semestres Universitarios (o ${phd} Doctorados)`;
            }
        });

        window.commitAudio = function() {
            if(slider.value == 0) return alert("¡Aprovecha el tiempo muerto!");
            alert("¡Vehículo transformado en Biblioteca!");
            sec3.classList.remove('locked');
            lock3.style.display = 'none';
            sec3.scrollIntoView({ behavior: 'smooth' });
        };
    }

    // --- 3. RADAR DE ASOCIACIONES ---
    const radar = document.querySelector('.radar-screen');
    const netMsg = document.getElementById('network-msg');
    const lock4 = document.getElementById('lock-11-4');
    const sec4 = document.getElementById('golden-hour-section');

    window.scanNetwork = function() {
        radar.classList.add('scanning');
        const btn = document.querySelector('.btn-scan');
        btn.textContent = "ESCANENDO...";
        
        setTimeout(() => {
            netMsg.classList.remove('hidden');
            btn.textContent = "ANÁLISIS COMPLETADO";
            
            // Permitir avanzar tras el shock
            setTimeout(() => {
                sec4.classList.remove('locked');
                lock4.style.display = 'none';
                sec4.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        }, 2000);
    };

    // --- 4. HORA DE ORO (Checklist) ---
    const checks = document.querySelectorAll('.boot-check');
    const finishBtn = document.getElementById('finish-chap-11');

    checks.forEach(check => {
        check.addEventListener('change', () => {
            // Verificar si todos están marcados
            const allChecked = Array.from(checks).every(c => c.checked);
            if (allChecked) {
                finishBtn.classList.remove('hidden');
            }
        });
    });

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Sistema...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 12,
                    cap11Completed: new Date()
                });
                alert("¡Dieta Mental Configurada! Eres lo que consumes.");
                updateSidebarProgress(12);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}