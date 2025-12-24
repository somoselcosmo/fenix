// js/chapters/chapter5.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter5() {
    
    // --- FASE 1: AUTOMÁTICA (El Manifiesto se lee solo) ---
    // Desbloqueamos la fase 2 tras 3 segundos de lectura simulada
    setTimeout(() => {
        const lock = document.getElementById('lock-5-2');
        const section = document.getElementById('excuse-section');
        if(lock && section) {
            lock.style.display = 'none';
            section.classList.remove('locked');
        }
    }, 3000);

    // --- FASE 2: EXCUSAS ---
    const excuses = [
        "No tengo tiempo", "Soy muy joven/viejo", "La economía está mal",
        "No tuve educación", "Es culpa de mis padres", "Mi jefe me odia",
        "Tengo mala suerte", "No tengo contactos", "Es muy difícil"
    ];

    const grid = document.getElementById('excuses-grid');
    const counterDisplay = document.getElementById('excuse-counter');
    let destroyedCount = 0;
    const TARGET_DESTROY = 3;

    if (grid) {
        // Generar botones
        grid.innerHTML = excuses.map(excuse => `
            <button class="excuse-btn" onclick="destroyExcuse(this)">${excuse}</button>
        `).join('');

        // Función global para el onclick
        window.destroyExcuse = function(btn) {
            if (btn.classList.contains('destroyed')) return;

            // Efecto visual
            btn.style.backgroundColor = "#ef4444";
            btn.style.borderColor = "#ef4444";
            
            setTimeout(() => {
                btn.classList.add('destroyed');
                destroyedCount++;
                counterDisplay.textContent = `Excusas eliminadas: ${destroyedCount} / ${TARGET_DESTROY}`;

                // Verificar victoria
                if (destroyedCount === TARGET_DESTROY) {
                    unlockMantraSection();
                }
            }, 300);
        };
    }

    function unlockMantraSection() {
        const section = document.getElementById('mantra-section');
        const lock = document.getElementById('lock-5-3');
        
        section.classList.remove('locked');
        if(lock) lock.style.display = 'none';
        
        // Scroll suave hacia abajo
        section.scrollIntoView({ behavior: 'smooth' });
    }

    // --- FASE 3: EL MANTRA ---
    const mantraInput = document.getElementById('mantra-input');
    const mantraFeedback = document.getElementById('mantra-feedback');
    const finishBtn = document.getElementById('finish-chap-5');
    const TARGET_PHRASE = "SOY RESPONSABLE";

    if (mantraInput) {
        mantraInput.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase();
            
            // Lógica de barra de progreso basada en coincidencia
            let matchCount = 0;
            for(let i=0; i<val.length; i++) {
                if(val[i] === TARGET_PHRASE[i]) matchCount++;
            }
            
            const percent = (matchCount / TARGET_PHRASE.length) * 100;
            mantraFeedback.style.width = `${percent}%`;

            if (val === TARGET_PHRASE) {
                mantraFeedback.style.background = "#22c55e"; // Verde
                mantraInput.style.borderColor = "#22c55e";
                mantraInput.style.color = "#22c55e";
                mantraInput.disabled = true; // Sellar
                
                finishBtn.classList.remove('hidden');
            } else {
                mantraFeedback.style.background = "#334155";
            }
        });
    }

    // --- FINALIZAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 6,
                    cap5Completed: new Date()
                });
                alert("¡Felicidades! Has tomado las riendas de tu vida.");
                updateSidebarProgress(6);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}