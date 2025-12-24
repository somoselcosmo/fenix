// js/chapters/chapter10.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter10() {
    
    // --- 1. GAP ANALYZER (Brecha de Autoestima) ---
    const slider = document.getElementById('ideal-slider');
    const idealPoint = document.getElementById('ideal-point');
    const feedback = document.getElementById('gap-feedback');
    const lockVava = document.getElementById('lock-10-2');
    const vavaSection = document.getElementById('vava-section');

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            // Movemos el punto ideal hacia la izquierda (acercándose al Yo Actual que está en 10%)
            // Rango visual: de 90% (lejos) a 25% (cerca)
            const position = 90 - (val * 0.65); 
            idealPoint.style.left = `${position}%`;

            if (val < 30) {
                feedback.textContent = "Ideal borroso. Autoestima baja.";
                feedback.style.color = "#94a3b8";
            } else if (val < 80) {
                feedback.textContent = "Definiendo ideal...";
                feedback.style.color = "#f59e0b";
            } else {
                feedback.textContent = "¡CLARIDAD TOTAL! Alta Autoestima.";
                feedback.style.color = "#22c55e";
                
                // Desbloquear fase 2
                if (vavaSection.classList.contains('locked')) {
                    vavaSection.classList.remove('locked');
                    lockVava.style.display = 'none';
                }
            }
        });
    }

    // --- 2. VAVA: VISUALIZACIÓN ---
    const btnVis = document.getElementById('btn-visualize');
    const stepAffirm = document.getElementById('a-step');

    if (btnVis) {
        btnVis.addEventListener('click', () => {
            document.body.classList.add('visualizing');
            
            setTimeout(() => {
                document.body.classList.remove('visualizing');
                btnVis.textContent = "Visualización Completada";
                btnVis.disabled = true;
                btnVis.style.borderColor = "#22c55e";
                btnVis.style.color = "#22c55e";
                
                stepAffirm.classList.remove('locked-step'); // Abrir paso 2
            }, 5000); // 5 segundos de oscuridad
        });
    }

    // --- 3. VAVA: AFIRMACIÓN (Validador 3 P's) ---
    const affInput = document.getElementById('affirmation-input');
    const affError = document.getElementById('affirmation-error');
    const btnAffirm = document.getElementById('btn-affirm');
    const stepVerbal = document.getElementById('ver-step');

    if (affInput) {
        affInput.addEventListener('input', () => {
            const text = affInput.value.trim();
            const firstWord = text.split(' ')[0]?.toLowerCase();
            
            // Reglas: Debe empezar con "Yo" (Personal) y no tener "no" (Positivo - simple check)
            // Nota: Detectar "Presente" es difícil, asumimos que "Yo soy/estoy/tengo" es presente.
            
            let isValid = false;
            let error = "";

            if (!text.toLowerCase().startsWith("yo")) {
                error = "ERROR: Debe ser PERSONAL. Empieza con 'Yo'.";
            } else if (text.toLowerCase().includes("no ") || text.toLowerCase().includes("nunca")) {
                error = "ERROR: Debe ser POSITIVO. Evita negaciones.";
            } else if (text.length < 10) {
                error = "Muy corta.";
            } else {
                isValid = true;
            }

            if (isValid) {
                affError.classList.add('hidden');
                btnAffirm.disabled = false;
                btnAffirm.style.background = "var(--accent)";
            } else {
                affError.textContent = error;
                affError.classList.remove('hidden');
                btnAffirm.disabled = true;
                btnAffirm.style.background = "";
            }
        });

        btnAffirm.addEventListener('click', () => {
            btnAffirm.textContent = "Afirmación Grabada";
            btnAffirm.disabled = true;
            stepVerbal.classList.remove('locked-step'); // Abrir paso 3
        });
    }

    // --- 4. VAVA: VERBALIZACIÓN (Botón de hablar) ---
    const btnSpeak = document.getElementById('btn-speak');
    const stepAct = document.getElementById('act-step');
    let speakTimer;

    if (btnSpeak) {
        btnSpeak.addEventListener('mousedown', () => {
            btnSpeak.textContent = "🎙️ ESCUCHANDO...";
            btnSpeak.classList.add('pulsing');
            
            speakTimer = setTimeout(() => {
                btnSpeak.textContent = "Verbalización Exitosa";
                btnSpeak.classList.remove('pulsing');
                btnSpeak.style.background = "#22c55e";
                btnSpeak.disabled = true;
                stepAct.classList.remove('locked-step'); // Abrir paso 4
            }, 3000);
        });

        btnSpeak.addEventListener('mouseup', () => {
            clearTimeout(speakTimer);
            if (!btnSpeak.disabled) {
                btnSpeak.textContent = "MANTÉN PULSADO Y HABLA";
                btnSpeak.classList.remove('pulsing');
            }
        });
    }

    // --- 5. VAVA: ASUNCIÓN (Switch) ---
    window.checkActorMode = function() {
        const sw = document.getElementById('switch-actor');
        const finishBtn = document.getElementById('finish-chap-10');
        
        if (sw.checked) {
            finishBtn.classList.remove('hidden');
            // Scroll al final
            finishBtn.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- GUARDAR ---
    const finishBtn = document.getElementById('finish-chap-10');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Reescribiendo Autoimagen...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 11,
                    cap10Completed: new Date(),
                    afirmacionMaestra: affInput.value // Guardamos su afirmación
                });
                alert("¡Nuevo Concepto Propio Instalado!");
                updateSidebarProgress(11);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}