// js/chapters/chapter8.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter8() {
    
    // --- 1. ESTADÍSTICAS ---
    window.revealStat = function(el, text) {
        const display = document.getElementById('stat-reveal-text');
        display.textContent = text;
        display.style.color = "var(--text-primary)";
        
        // Si toca la real (8%), desbloqueamos la fase 2
        if (text.includes("4%")) {
            const lock = document.getElementById('lock-8-2');
            const section = document.getElementById('worry-machine-section');
            if(lock && section.classList.contains('locked')) {
                display.innerHTML = text + " <br><strong style='color:#22c55e'>¡Máquina Desbloqueada!</strong>";
                setTimeout(() => {
                    section.classList.remove('locked');
                    lock.style.display = 'none';
                    section.scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }
        }
    };

    // --- 2. EL MAGO (WIZARD) ---
    window.nextWorryStep = function(step) {
        // Validaciones
        if (step === 2) {
            const val = document.getElementById('worry-input-1').value;
            if (val.length < 5) return alert("Define tu preocupación.");
        }
        if (step === 3) {
            const val = document.getElementById('worry-input-2').value;
            if (val.length < 5) return alert("Define el peor caso. Sé valiente.");
            // Copiar texto para la aceptación
            document.getElementById('worst-case-display').textContent = `"${val}"`;
        }

        // Transición
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.add('hidden'));
        const nextEl = document.getElementById(`w-step-${step}`);
        nextEl.classList.remove('hidden');
    };

    window.finishWorryProcess = function() {
        const action = document.getElementById('worry-action').value;
        if (action.length < 3) return alert("Define una acción.");

        alert("¡Preocupación destruida! Has tomado acción.");
        document.getElementById('worry-machine-section').style.opacity = "0.5"; // Desactivar visualmente
        document.getElementById('worry-machine-section').style.pointerEvents = "none";
        
        document.getElementById('finish-chap-8-container').classList.remove('hidden');
    };

    // --- 3. GUARDAR ---
    const finishBtn = document.getElementById('finish-chap-8');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            
            // Opcional: Guardar la preocupación procesada en un historial
            const worryText = document.getElementById('worry-input-1').value;
            
            try {
                const uid = auth.currentUser.uid;
                
                // 1. Guardar el progreso general
                await updateDoc(doc(db, "usuarios", uid), {
                    nivelActual: 9, // Desbloquea Cap 9
                    cap8Completed: new Date()
                });

                // 2. Guardar la preocupación en una subcolección (Historial)
                // Esto es avanzado, pero útil: crea una colección dentro del usuario
                // await addDoc(collection(db, "usuarios", uid, "worries_history"), {
                //     worry: worryText,
                //     date: new Date()
                // });

                alert("¡Paz Mental Restaurada! Módulo 8 Completado.");
                updateSidebarProgress(9);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}