// js/chapters/chapter19.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter19() {
    
    // --- 1. SOLEDAD (Detector de Inactividad) ---
    const voidChamber = document.getElementById('void-chamber');
    const voidStatus = document.getElementById('void-status');
    const voidFeedback = document.getElementById('void-feedback');
    const lock2 = document.getElementById('lock-19-2');
    const sec2 = document.getElementById('delegation-section');
    
    let stillnessTimer;
    let isMeditating = false;

    if (voidChamber) {
        voidChamber.addEventListener('click', () => {
            if (isMeditating) return;
            
            isMeditating = true;
            voidChamber.classList.add('active');
            voidStatus.textContent = "Mantente quieto...";
            
            // Detección de movimiento (rompe el trance)
            const breakTrance = () => {
                if (!isMeditating) return;
                isMeditating = false;
                voidChamber.classList.remove('active');
                voidStatus.textContent = "Movimiento detectado. Reiniciando...";
                voidStatus.style.color = "#ef4444";
                clearTimeout(stillnessTimer);
                
                setTimeout(() => {
                    voidStatus.textContent = "Haz clic para entrar al Vacío (30s)";
                    voidStatus.style.color = "#666";
                }, 1000);
            };

            // Si mueve el mouse dentro, falla (Opcional: puedes ser menos estricto)
            // voidChamber.addEventListener('mousemove', breakTrance);

            // Éxito tras 5 segundos (simulados, en prod 30s)
            stillnessTimer = setTimeout(() => {
                isMeditating = false;
                // voidChamber.removeEventListener('mousemove', breakTrance);
                
                voidChamber.classList.remove('active');
                voidChamber.style.border = "2px solid #a78bfa";
                voidStatus.textContent = "MENTE CLARA";
                voidStatus.style.color = "#a78bfa";
                voidFeedback.classList.remove('hidden');

                setTimeout(() => {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }, 1500);
            }, 5000); // 5000ms = 5s para demo
        });
    }

    // --- 2. DELEGACIÓN ---
    const btnDelegate = document.getElementById('btn-delegate');
    const problemInput = document.getElementById('problem-input');
    const procMsg = document.getElementById('processing-msg');
    const lock3 = document.getElementById('lock-19-3');
    const sec3 = document.getElementById('serendipity-section');

    if (btnDelegate) {
        btnDelegate.addEventListener('click', () => {
            if (problemInput.value.length < 5) return alert("Define el problema.");
            
            problemInput.disabled = true;
            btnDelegate.classList.add('hidden');
            procMsg.classList.remove('hidden');
            
            // Simular envío a la nube
            setTimeout(() => {
                alert("Problema entregado. La respuesta llegará cuando menos la esperes.");
                
                sec3.classList.remove('locked');
                lock3.style.display = 'none';
                sec3.scrollIntoView({ behavior: 'smooth' });
                
                // Iniciar radar
                startRadar();
            }, 2000);
        });
    }

    // --- 3. RADAR ---
    function startRadar() {
        const s1 = document.getElementById('signal-1');
        const s2 = document.getElementById('signal-2');
        const finishBtn = document.getElementById('finish-chap-19');

        setTimeout(() => s1.classList.remove('hidden'), 2000);
        setTimeout(() => s2.classList.remove('hidden'), 4000);
        
        setTimeout(() => {
            finishBtn.classList.remove('hidden');
        }, 5000);
    }

    // --- GUARDAR ---
    const finishBtn = document.getElementById('finish-chap-19');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Conectando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 20,
                    cap19Completed: new Date(),
                    problemaDelegado: problemInput.value
                });
                alert("¡Conexión Súper Consciente Establecida!");
                updateSidebarProgress(20);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}