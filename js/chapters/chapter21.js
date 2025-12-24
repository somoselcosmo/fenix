// js/chapters/chapter21.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter21() {
    
    // ESTADO DEL SISTEMA
    let energyLevel = 20; // Inicial (Bajo)
    let activeDs = 0;
    let purgedPoisons = 0;

    const batteryFill = document.getElementById('battery-charge');
    const batteryText = document.getElementById('battery-text');
    const statusText = document.getElementById('energy-status');
    
    const lock2 = document.getElementById('lock-21-2');
    const sec2 = document.getElementById('detox-section');
    const lock3 = document.getElementById('lock-21-3');
    const sec3 = document.getElementById('vitality-section');
    const finishBtn = document.getElementById('finish-chap-21');

    // Función Central de Actualización
    function updateBatteryDisplay() {
        // Topes
        if (energyLevel > 100) energyLevel = 100;
        if (energyLevel < 0) energyLevel = 0;

        batteryFill.style.width = `${energyLevel}%`;
        batteryText.textContent = `${Math.floor(energyLevel)}%`;

        // Colores
        batteryFill.classList.remove('low', 'med', 'high');
        if (energyLevel < 40) {
            batteryFill.classList.add('low');
            statusText.textContent = "ESTADO: CRÍTICO (Modo Supervivencia)";
            statusText.style.color = "#ef4444";
        } else if (energyLevel < 80) {
            batteryFill.classList.add('med');
            statusText.textContent = "ESTADO: ESTABLE (Funcionamiento Normal)";
            statusText.style.color = "#f59e0b";
        } else {
            batteryFill.classList.add('high');
            statusText.textContent = "ESTADO: ALTO RENDIMIENTO (Flujo)";
            statusText.style.color = "#22c55e";
            finishBtn.classList.remove('hidden');
        }
    }

    // --- 1. LAS 5 D's ---
    window.toggleIgnition = function(btn) {
        if (btn.classList.contains('active')) return;
        
        btn.classList.add('active');
        activeDs++;
        energyLevel += 5; // Cada D suma 5%
        updateBatteryDisplay();

        if (activeDs === 5) {
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    };

    // --- 2. DESINTOXICACIÓN ---
    window.purgePoison = function(el) {
        if (el.classList.contains('purged')) return;

        // Efecto visual
        el.style.transform = "scale(1.1)";
        setTimeout(() => {
            el.classList.add('purged');
            el.innerHTML = "<h4>ELIMINADO</h4>";
            
            purgedPoisons++;
            energyLevel += 10; // Quitar veneno sube mucho la energía
            updateBatteryDisplay();

            if (purgedPoisons === 3) {
                setTimeout(() => {
                    if(sec3.classList.contains('locked')) {
                        sec3.classList.remove('locked');
                        lock3.style.display = 'none';
                        sec3.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
        }, 200);
    };

    // --- 3. ECUALIZADOR (Sliders) ---
    window.calcEnergy = function() {
        const sliders = document.querySelectorAll('.energy-slider');
        let sliderTotal = 0;
        
        sliders.forEach(s => sliderTotal += parseInt(s.value));
        
        // Promedio de los 4 sliders (que van de 0 a 100)
        // Aportan los últimos 25 puntos de energía para llegar al 100%
        // Base actual (aprox 75%) + (Promedio / 4)
        
        // Recalculamos energía base para no sumar infinito
        const baseEnergy = 20 + (activeDs * 5) + (purgedPoisons * 10);
        const bonusEnergy = sliderTotal / 16; // Ajuste matemático
        
        energyLevel = baseEnergy + bonusEnergy;
        updateBatteryDisplay();
    };

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Cargando Sistema...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 22,
                    cap21Completed: new Date(),
                    nivelEnergia: Math.floor(energyLevel)
                });
                alert("¡Bio-Reactor Optimizado! Estás listo para vivir 80 años.");
                updateSidebarProgress(22);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}