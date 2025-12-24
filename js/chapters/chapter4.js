// js/chapters/chapter4.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter4() {
    
    // --- 1. LEY DE ACTIVIDAD SUBCONSCIENTE (El Jardín) ---
    window.plantSeed = function(type) {
        const display = document.getElementById('garden-display');
        const nextLock = document.getElementById('lock-4-2');
        const nextSection = document.getElementById('substitution-section');

        if (type === 'fear') {
            display.innerHTML = '<span style="font-size:3rem">🌵🕷️🥀</span>';
            display.style.background = "#2a0a0a";
            display.style.borderColor = "#ef4444";
            setTimeout(() => alert("Cuidado. Tu subconsciente no distingue bromas. Si plantas miedo, cosechas parálisis."), 100);
        } else {
            display.innerHTML = '<span style="font-size:3rem">🌳🍎🌻</span>';
            display.style.background = "#0a2a1a";
            display.style.borderColor = "#22c55e";
            
            // Desbloquear siguiente
            if (nextSection.classList.contains('locked')) {
                nextSection.classList.remove('locked');
                nextLock.style.display = 'none';
            }
        }
    };

    // --- 2. LEY DE SUSTITUCIÓN (El Interruptor) ---
    const btnSub = document.getElementById('btn-substitute');
    const thoughtDisplay = document.getElementById('thought-display');
    const nextLockConc = document.getElementById('lock-4-3');
    const concSection = document.getElementById('concentration-section');

    let isNegative = true;

    if (btnSub) {
        btnSub.addEventListener('click', () => {
            if (isNegative) {
                // SUSTITUCIÓN
                thoughtDisplay.textContent = "¡YO PUEDO!";
                thoughtDisplay.className = "thought positive";
                btnSub.textContent = "Volver a dudar (Imposible)";
                btnSub.disabled = true; // No dejamos volver atrás por ahora
                
                // Desbloquear siguiente
                setTimeout(() => {
                    if (concSection.classList.contains('locked')) {
                        concSection.classList.remove('locked');
                        nextLockConc.style.display = 'none';
                    }
                }, 1000);
                
                isNegative = false;
            }
        });
    }

    // --- 3. LEY DE CONCENTRACIÓN (Hold Button) ---
    const btnFocus = document.getElementById('btn-focus');
    const focusCircle = document.getElementById('focus-circle');
    const finishBtn = document.getElementById('finish-chap-4');
    let focusInterval;
    let focusSize = 10; // Tamaño inicial px

    if (btnFocus) {
        // Al presionar (Mousedown / Touchstart)
        const startFocus = (e) => {
            e.preventDefault(); // Evitar scroll en móvil
            btnFocus.textContent = "CONCENTRANDO...";
            
            focusInterval = setInterval(() => {
                focusSize += 2;
                focusCircle.style.width = `${focusSize}px`;
                focusCircle.style.height = `${focusSize}px`;
                
                // Si llega al tamaño objetivo (140px)
                if (focusSize >= 140) {
                    clearInterval(focusInterval);
                    focusCircle.classList.add('growing'); // Efecto brillo final
                    btnFocus.textContent = "¡MATERIALIZADO!";
                    btnFocus.style.background = "#22c55e";
                    btnFocus.disabled = true;
                    
                    // Mostrar botón final
                    finishBtn.classList.remove('hidden');
                }
            }, 50); // Velocidad de crecimiento
        };

        // Al soltar (Mouseup / Touchend)
        const stopFocus = () => {
            clearInterval(focusInterval);
            if (focusSize < 140) {
                // Si suelta antes, se pierde la concentración (baja rápido)
                focusSize = 10;
                focusCircle.style.width = `${focusSize}px`;
                focusCircle.style.height = `${focusSize}px`;
                btnFocus.textContent = "MANTENER FOCO (Inténtalo de nuevo)";
            }
        };

        btnFocus.addEventListener('mousedown', startFocus);
        btnFocus.addEventListener('touchstart', startFocus);
        
        btnFocus.addEventListener('mouseup', stopFocus);
        btnFocus.addEventListener('mouseleave', stopFocus);
        btnFocus.addEventListener('touchend', stopFocus);
    }

    // --- FINALIZAR CAPÍTULO ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 5,
                    cap4Completed: new Date()
                });
                alert("¡Has reprogramado tu Subconsciente! Nivel 5 Desbloqueado.");
                updateSidebarProgress(5);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}