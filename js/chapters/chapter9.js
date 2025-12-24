// js/chapters/chapter9.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter9() {
    
    // --- 1. ROMPER HOMEOSTASIS ---
    const comfortBox = document.getElementById('comfort-zone-box');
    const breakCounter = document.getElementById('break-counter');
    let clicks = 0;
    const TARGET_CLICKS = 10;

    if (comfortBox) {
        comfortBox.addEventListener('mousedown', () => {
            if (clicks >= TARGET_CLICKS) return;

            clicks++;
            const remaining = TARGET_CLICKS - clicks;
            
            // Efecto visual
            comfortBox.classList.add('breaking');
            setTimeout(() => comfortBox.classList.remove('breaking'), 100);
            
            breakCounter.textContent = `Resistencia debilitada... faltan ${remaining} golpes`;

            if (clicks >= TARGET_CLICKS) {
                // Roto
                comfortBox.classList.add('broken');
                breakCounter.textContent = "¡ZONA DE CONFORT ROTA!";
                breakCounter.style.color = "#22c55e";
                
                // Desbloquear fase 2
                setTimeout(() => {
                    document.getElementById('four-d-section').classList.remove('locked');
                    document.getElementById('lock-9-2').style.display = 'none';
                    document.getElementById('four-d-section').scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }
        });
    }

    // --- 2. LOS 4 MOTORES (Secuenciales) ---
    window.checkFourDs = function() {
        const s1 = document.getElementById('switch-desire');
        const s2 = document.getElementById('switch-decision');
        const s3 = document.getElementById('switch-determination');
        const s4 = document.getElementById('switch-discipline');

        // Habilitar en cascada
        if (s1.checked) {
            s2.disabled = false;
            s1.closest('.switch-card').classList.add('active');
        } else {
            s2.disabled = true; s2.checked = false;
            s3.disabled = true; s3.checked = false;
            s4.disabled = true; s4.checked = false;
            resetCards();
        }

        if (s2.checked) {
            s3.disabled = false;
            s2.closest('.switch-card').classList.add('active');
        }

        if (s3.checked) {
            s4.disabled = false;
            s3.closest('.switch-card').classList.add('active');
        }

        if (s4.checked) {
            s4.closest('.switch-card').classList.add('active');
            
            // Desbloquear fase 3
            setTimeout(() => {
                document.getElementById('habit-script-section').classList.remove('locked');
                document.getElementById('lock-9-3').style.display = 'none';
                document.getElementById('habit-script-section').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    };

    function resetCards() {
        document.querySelectorAll('.switch-card').forEach(c => c.classList.remove('active'));
    }

    // --- 3. TERMINAL DE HÁBITO ---
    const habitInput = document.getElementById('habit-input');
    const finishBtn = document.getElementById('finish-chap-9');

    if (habitInput) {
        habitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (habitInput.value.length < 5) return alert("Define un hábito real.");
                
                habitInput.disabled = true;
                document.getElementById('habit-confirmation').classList.remove('hidden');
                finishBtn.classList.remove('hidden');
            }
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Instalando...";
            const habit = document.getElementById('habit-input').value;

            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 10,
                    cap9Completed: new Date(),
                    nuevoHabito21Dias: habit // Guardamos el hábito específico
                });
                alert("¡Programación Exitosa! Hábito instalado en el sistema.");
                updateSidebarProgress(10);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}