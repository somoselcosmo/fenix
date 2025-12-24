// js/chapters/chapter23.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter23() {
    
    // --- ESTADO INICIAL ---
    let pressure = 100;
    const needle = document.getElementById('pressure-needle');
    const pressureVal = document.getElementById('pressure-val');
    const pressureStatus = document.getElementById('pressure-status');
    const dashboard = document.querySelector('.pressure-dashboard');
    
    const lock2 = document.getElementById('lock-23-2');
    const sec2 = document.getElementById('closure-section');
    const lock3 = document.getElementById('lock-23-3');
    const sec3 = document.getElementById('denial-section');
    const finishBtn = document.getElementById('finish-chap-23');

    // Función de actualización del medidor
    function updatePressure(amount) {
        pressure -= amount;
        if (pressure < 0) pressure = 0;

        // Visual
        pressureVal.textContent = pressure;
        // Mapear 0-100 PSI a 0-180 Grados
        const deg = (pressure / 100) * 180;
        needle.style.transform = `rotate(${deg}deg)`;

        // Colores y Mensajes
        if (pressure > 60) {
            pressureStatus.textContent = "ALERTA: PRESIÓN CRÍTICA";
            pressureStatus.className = "feedback-text warning";
            dashboard.className = "pressure-dashboard";
        } else if (pressure > 20) {
            pressureStatus.textContent = "ESTADO: DESCOMPRIMIENDO...";
            pressureStatus.className = "feedback-text";
            dashboard.className = "pressure-dashboard";
        } else {
            pressureStatus.textContent = "ESTADO: PAZ MENTAL (FLUJO)";
            pressureStatus.className = "feedback-text safe";
            dashboard.className = "pressure-dashboard safe";
        }
    }

    // --- 1. TIPO A -> TIPO B ---
    window.checkPressure = function() {
        const toggles = document.querySelectorAll('.behavior-toggle');
        const checkedCount = Array.from(toggles).filter(t => t.checked).length;
        
        // Cada switch reduce 10 PSI (Total 40)
        // Calculamos en base al estado actual de los switches
        // Para no complicar la lógica de resta, recaluculamos base
        
        // Base sin switches es 100.
        // Restamos 10 por cada switch activo.
        // Pero tenemos otras tareas (carta y realidad).
        // Vamos a hacer que bajen dinámicamente.
        
        const pressureDrop = checkedCount * 10;
        // Asumimos que la carta vale 30 y la negación 30.
        
        // Simplemente actualizamos visualmente restando 10 por cada nuevo
        // Pero necesitamos estado.
        // Mejor: Cada vez que cambia, recalculamos todo el score.
        recalcTotalPressure();
    };

    // --- 2. LA CARTA ---
    const btnSend = document.getElementById('btn-send-letter');
    const letterTo = document.getElementById('letter-to');
    const letterBody = document.getElementById('letter-body');
    let letterSent = false;

    if (btnSend) {
        btnSend.addEventListener('click', () => {
            if (letterTo.value.length < 2 || letterBody.value.length < 10) {
                return alert("Escribe una carta real para liberar la emoción.");
            }

            // Animación
            document.querySelector('.paper').classList.add('sent');
            btnSend.textContent = "ENVIADA / QUEMADA 🔥";
            btnSend.disabled = true;
            letterSent = true;

            setTimeout(() => {
                recalcTotalPressure();
                
                // Desbloquear fase 3
                if(sec3.classList.contains('locked')) {
                    sec3.classList.remove('locked');
                    lock3.style.display = 'none';
                    sec3.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }

    // --- 3. NEGACIÓN ---
    let realityFaced = false;
    window.faceReality = function() {
        const input = document.getElementById('reality-input');
        if (input.value.length < 5) return alert("Admite la verdad.");

        input.disabled = true;
        realityFaced = true;
        recalcTotalPressure();
        
        finishBtn.classList.remove('hidden');
    };

    // FUNCIÓN CENTRAL DE CÁLCULO
    function recalcTotalPressure() {
        let currentP = 100;

        // Switches (4 switches * 10 pts c/u = 40 pts)
        const toggles = document.querySelectorAll('.behavior-toggle');
        const checkedCount = Array.from(toggles).filter(t => t.checked).length;
        currentP -= (checkedCount * 10);

        // Carta (30 pts)
        if (letterSent) currentP -= 30;

        // Realidad (30 pts)
        if (realityFaced) currentP -= 30;

        // Actualizar UI
        updatePressure(100 - currentP); // updatePressure resta, así que pasamos la diferencia
        // Corrección: mi función updatePressure RESTA de una variable local.
        // Vamos a sobrescribir la variable local para ser precisos.
        pressure = currentP;
        
        // Actualizar visuales con el nuevo valor absoluto
        pressureVal.textContent = pressure;
        const deg = (pressure / 100) * 180; // 100 PSI = 180deg (Derecha), 0 PSI = 0deg (Izquierda)?
        // Normalmente manómetros: 0 es izq, 100 es der.
        // Si quiero que baje a verde (izq):
        // 100 PSI (Rojo) -> 180deg
        // 0 PSI (Verde) -> 0deg
        needle.style.transform = `rotate(${deg}deg)`;
        
        if (pressure > 60) {
            pressureStatus.textContent = "ALERTA: PRESIÓN CRÍTICA";
            pressureStatus.className = "feedback-text warning";
            dashboard.className = "pressure-dashboard";
        } else if (pressure > 20) {
            pressureStatus.textContent = "ESTADO: DESCOMPRIMIENDO...";
            pressureStatus.className = "feedback-text";
            dashboard.className = "pressure-dashboard";
            
            // Desbloquear fase 2 si no está
            if (checkedCount === 4 && sec2.classList.contains('locked')) {
                sec2.classList.remove('locked');
                lock2.style.display = 'none';
                sec2.scrollIntoView({ behavior: 'smooth' });
            }

        } else {
            pressureStatus.textContent = "ESTADO: PAZ MENTAL (FLUJO)";
            pressureStatus.className = "feedback-text safe";
            dashboard.className = "pressure-dashboard safe";
        }
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Paz...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 24,
                    cap23Completed: new Date()
                });
                alert("¡Sistema Descomprimido! Estás en Control Cognitivo.");
                updateSidebarProgress(24);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
    
    // Iniciar aguja en 100 (180deg)
    setTimeout(() => {
        needle.style.transform = `rotate(180deg)`;
    }, 500);
}