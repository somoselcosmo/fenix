// js/chapters/chapter25.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter25() {
    
    // --- 1. SINTONIZADOR DE PAREJA ---
    const sVal = document.getElementById('slider-values');
    const sTemp = document.getElementById('slider-temp');
    const osc = document.querySelector('.oscilloscope');
    const status = document.getElementById('res-status');
    const trace = document.getElementById('wave-trace');
    
    const lock2 = document.getElementById('lock-25-2');
    const sec2 = document.getElementById('friend-test-section');

    if (sVal && sTemp) {
        window.checkResonance = function() {
            const valScore = parseInt(sVal.value);
            const tempScore = parseInt(sTemp.value);
            
            if (valScore > 80 && tempScore > 80) {
                osc.classList.add('harmonic');
                status.textContent = "SEÑAL: RESONANCIA ARMÓNICA (Perfecta)";
                status.style.color = "#22c55e";
                
                setTimeout(() => {
                    if(sec2 && sec2.classList.contains('locked')) {
                        sec2.classList.remove('locked');
                        if(lock2) lock2.style.display = 'none';
                        sec2.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);
            } else {
                osc.classList.remove('harmonic');
                const resonance = (valScore + tempScore) / 2;
                if(trace) trace.style.transform = `scaleY(${1 + (100-resonance)/50})`;
                
                if (valScore < 50) status.textContent = "SEÑAL: VALORES EN CONFLICTO";
                else if (tempScore < 50) status.textContent = "SEÑAL: TEMPERAMENTO CHOCA (Muy iguales)";
                else status.textContent = "SEÑAL: SINTONIZANDO...";
                
                status.style.color = "#ff00ff";
            }
        };
    }

    // --- 2. TEST MEJOR AMIGO ---
    let answers = { 1: null, 2: null, 3: null };
    const resBox = document.getElementById('test-result');
    const resText = document.getElementById('res-text');
    const resDesc = document.getElementById('res-desc');
    const btnProceed = document.getElementById('btn-proceed-25');
    
    // Referencias a la siguiente sección (Comunicación)
    const lock3 = document.getElementById('lock-25-3');
    const sec3 = document.getElementById('comm-section');

    window.answerTest = function(qIndex, isYes, btnElement) {
        answers[qIndex] = isYes;
        
        // Efecto visual en botones
        if (btnElement && btnElement.parentElement) {
            const siblings = btnElement.parentElement.querySelectorAll('.yn-btn');
            siblings.forEach(btn => {
                btn.classList.remove('selected-yes', 'selected-no');
                btn.style.opacity = "0.5";
            });
            btnElement.style.opacity = "1";
            if (isYes) btnElement.classList.add('selected-yes');
            else btnElement.classList.add('selected-no');
        }
        
        // Verificar si se respondieron las 3
        if (answers[1] !== null && answers[2] !== null && answers[3] !== null) {
            analyzeResult();
        }
    };

    function analyzeResult() {
        if(!resBox) return;
        resBox.classList.remove('hidden'); // Mostrar caja gris
        
        // Lógica de resultado y visualización del botón
        if (answers[1] === true && answers[2] === true && answers[3] === true) {
            resText.textContent = "RELACIÓN SÓLIDA";
            resText.style.color = "#22c55e";
            resDesc.textContent = "Tienes la base perfecta: Amistad y Respeto.";
            
            if(btnProceed) {
                btnProceed.textContent = "Proceder a Comunicación";
                btnProceed.classList.remove('hidden'); // Mostrar botón
            }
        } else {
            resText.textContent = "ALERTA DE INCOMPATIBILIDAD";
            resText.style.color = "#ef4444";
            resDesc.textContent = "Brian Tracy dice: 'Si no ríes con tu pareja, la relación ha muerto'.";
            
            if(btnProceed) {
                btnProceed.textContent = "Entendido (Continuar con Precaución)";
                btnProceed.classList.remove('hidden'); // Mostrar botón
            }
        }
    }

    // --- ESTA ES LA PARTE QUE FALTABA O ESTABA ROTA ---
    // Event Listener para el botón "Proceder"
    if (btnProceed) {
        btnProceed.addEventListener('click', () => {
            // Desbloquear siguiente sección manualmente
            if (sec3) {
                sec3.classList.remove('locked');
                if(lock3) lock3.style.display = 'none';
                sec3.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 3. COMUNICACIÓN (Juego de Ritmo) ---
    const beam = document.getElementById('signal-strength');
    const btnSignal = document.getElementById('btn-maintain-signal');
    const failMsg = document.getElementById('signal-fail-msg');
    const finishBtn = document.getElementById('finish-chap-25');
    
    let signalLevel = 100;
    let gameActive = false;
    let decayInterval;

    if (btnSignal) {
        btnSignal.addEventListener('click', () => {
            if (!gameActive) startGame();
            
            // Recargar señal
            signalLevel += 15;
            if (signalLevel > 100) signalLevel = 100;
            updateBeam();
        });
    }

    function startGame() {
        gameActive = true;
        btnSignal.textContent = "¡MANTÉN EL RITMO! (Clic, Clic...)";
        if(failMsg) failMsg.classList.add('hidden');
        
        let duration = 0;
        
        decayInterval = setInterval(() => {
            signalLevel -= 2; // Decae rápido
            duration++;
            updateBeam();

            if (signalLevel <= 0) {
                gameOver();
            }

            // Ganar tras unos 10 segundos
            if (duration > 100) { 
                winGame();
            }
        }, 100);
    }

    function updateBeam() {
        if(!beam) return;
        beam.style.width = `${signalLevel}%`;
        if (signalLevel < 30) beam.style.backgroundColor = "#ef4444";
        else beam.style.backgroundColor = "#ff00ff";
    }

    function gameOver() {
        clearInterval(decayInterval);
        gameActive = false;
        signalLevel = 100;
        if(beam) beam.style.width = "100%";
        btnSignal.textContent = "💔 SE CORTÓ LA SEÑAL. REINICIAR.";
        if(failMsg) failMsg.classList.remove('hidden');
    }

    function winGame() {
        clearInterval(decayInterval);
        gameActive = false;
        btnSignal.disabled = true;
        btnSignal.textContent = "CONEXIÓN PROFUNDA ESTABLECIDA";
        btnSignal.style.backgroundColor = "#22c55e";
        
        if(beam) {
            beam.style.backgroundColor = "#22c55e";
            beam.style.boxShadow = "0 0 20px #22c55e";
        }
        
        if(finishBtn) {
            finishBtn.classList.remove('hidden');
            finishBtn.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 26, // Avanzar al Cap 26
                    cap25Completed: new Date()
                });
                alert("¡Relaciones Armonizadas! Módulo Completado.");
                updateSidebarProgress(26);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}