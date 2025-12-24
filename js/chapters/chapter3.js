// js/chapters/chapter3.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter3() {
    
    // --- PARTE 1: LA CALCULADORA PHI ---
    const rangeAI = document.getElementById('range-ai');
    const rangeAA = document.getElementById('range-aa');
    const rangeA = document.getElementById('range-a');
    
    if (rangeAI && rangeAA && rangeA) {
        const calculatePHI = () => {
            const ai = parseInt(rangeAI.value);
            const aa = parseInt(rangeAA.value);
            const a = parseInt(rangeA.value);

            // Fórmula: (AI + AA) * A
            const phi = (ai + aa) * a;
            
            // Renderizado
            document.getElementById('phi-value').textContent = phi;
            
            // La barra se llena sobre un máximo teórico de 200 ((10+10)*10)
            const percentage = (phi / 200) * 100;
            document.getElementById('phi-fill').style.width = `${percentage}%`;

            // Mensajes dinámicos
            const msgEl = document.getElementById('phi-message');
            const reactorLock = document.getElementById('reactor-section');
            
            if (a === 0) {
                msgEl.textContent = "Sin Actitud, tu potencial es CERO. No importa tu talento.";
                msgEl.style.color = "#ef4444";
            } else if (phi > 140) {
                msgEl.textContent = "¡Potencial Desbloqueado! Tu actitud multiplica tu talento.";
                msgEl.style.color = "#22c55e";
                
                // DESBLOQUEO DE FASE 2
                if(reactorLock && reactorLock.classList.contains('locked')) {
                    reactorLock.classList.remove('locked');
                    document.getElementById('reactor-lock').style.display = 'none';
                }
            } else {
                msgEl.textContent = "Sube tu Actitud para ver resultados exponenciales.";
                msgEl.style.color = "#fff";
            }
        };

        rangeAI.addEventListener('input', calculatePHI);
        rangeAA.addEventListener('input', calculatePHI);
        rangeA.addEventListener('input', calculatePHI);
    }

    // --- PARTE 2: EL REACTOR DE AUTOESTIMA ---
    const pumpBtn = document.getElementById('pump-btn');
    const energyBar = document.getElementById('energy-bar');
    const finishBtn = document.getElementById('finish-chap-3');
    
    let energyLevel = 0;
    const MAX_ENERGY = 100;
    const DECAY_RATE = 0.5; // Qué tan rápido baja la energía si no bombeas

    if (pumpBtn) {
        // Loop de decaimiento (La autoestima baja si no se mantiene)
        setInterval(() => {
            if (energyLevel > 0 && energyLevel < MAX_ENERGY) {
                energyLevel -= DECAY_RATE;
                updateEnergyUI();
            }
        }, 100);

        // Acción de Bombear
        pumpBtn.addEventListener('mousedown', () => { // Usamos mousedown para respuesta rápida
            if (energyLevel >= MAX_ENERGY) return;

            // Efecto visual
            pumpBtn.classList.remove('pump-effect');
            void pumpBtn.offsetWidth; // Reflow
            pumpBtn.classList.add('pump-effect');

            // Lógica: Sumamos energía
            energyLevel += 5; // Cada clic suma 5%
            if (energyLevel > MAX_ENERGY) energyLevel = MAX_ENERGY;
            
            updateEnergyUI();

            // Si llegamos al máximo
            if (energyLevel >= MAX_ENERGY) {
                visualSuccess();
            }
        });
    }

    function updateEnergyUI() {
        if(energyBar) energyBar.style.width = `${energyLevel}%`;
    }

    function visualSuccess() {
        const circle = document.querySelector('.circle.esteem');
        circle.style.boxShadow = "0 0 50px #22c55e";
        circle.style.borderColor = "#22c55e";
        
        pumpBtn.style.background = "#22c55e";
        pumpBtn.innerHTML = "⚡";
        pumpBtn.disabled = true;

        document.querySelector('.instruction-blink').textContent = "¡SISTEMA CARGADO! Eres imparable.";
        document.querySelector('.instruction-blink').style.color = "#22c55e";
        
        finishBtn.classList.remove('hidden');
    }

    // --- GUARDAR Y FINALIZAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 4, // Pasamos al nivel 4
                    cap3Completed: new Date()
                });
                
                alert("¡Módulo 3 Completado! Tu potencial está activo.");
                updateSidebarProgress(4);
                // Futura redirección
            } catch (error) {
                console.error(error);
                alert("Error al guardar.");
            }
        });
    }
}