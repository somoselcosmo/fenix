// js/chapters/chapter16.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';
// 1. IMPORTAMOS LA FUNCIÓN DE NAVEGACIÓN (Esto faltaba)
import { showChapterView } from '../core/router.js'; 

export function initChapter16() {
    
    const goalData = {};

    // Función Global para avanzar fases
    window.nextPhase = function(phaseNum) {
        if (phaseNum === 2) {
            const desire = document.getElementById('c16-desire').value;
            const write = document.getElementById('c16-write').value;
            if (desire.length < 5 || write.length < 5) return alert("Completa el paso 1 y 3.");
            
            goalData.desire = desire;
            goalData.belief = document.getElementById('c16-belief').value;
            goalData.writtenGoal = write;
        }

        if (phaseNum === 3) {
            const why = document.getElementById('c16-why').value;
            const date = document.getElementById('c16-deadline').value;
            if (!why || !date) return alert("Define el Por qué y la Fecha.");
            
            goalData.why = why;
            goalData.startingPoint = document.getElementById('c16-start').value;
            goalData.deadline = date;
        }

        if (phaseNum === 4) {
            const obs = document.getElementById('c16-obstacle').value;
            if (!obs) return alert("Identifica tu obstáculo principal.");
            
            goalData.obstacle = obs;
            goalData.knowledge = document.getElementById('c16-knowledge').value;
            goalData.people = document.getElementById('c16-people').value;
        }

        document.querySelectorAll('.phase-group').forEach(p => p.classList.add('hidden'));
        document.getElementById(`phase-${phaseNum}`).classList.remove('hidden');
        
        document.querySelectorAll('.mission-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`m-step-${phaseNum}`).classList.add('active');
        
        document.querySelector('.launch-pad').scrollIntoView({ behavior: 'smooth' });
    };

    // Slider
    const beliefSlider = document.getElementById('c16-belief');
    const beliefVal = document.getElementById('belief-val');
    if(beliefSlider) {
        beliefSlider.addEventListener('input', (e) => {
            beliefVal.textContent = `${e.target.value}% Creencia`;
            if (e.target.value < 50) beliefVal.style.color = "#ef4444";
            else if (e.target.value > 90) beliefVal.style.color = "#22c55e";
            else beliefVal.style.color = "#fff";
        });
    }

    // Visualización
    const btnVis = document.getElementById('btn-visualize-16');
    if(btnVis) {
        btnVis.addEventListener('click', () => {
            document.body.classList.add('visualizing');
            btnVis.textContent = "SIMULANDO...";
            
            setTimeout(() => {
                document.body.classList.remove('visualizing');
                btnVis.textContent = "VISUALIZACIÓN COMPLETADA";
                btnVis.disabled = true;
                btnVis.style.background = "#22c55e";
                checkLaunchReady();
            }, 5000);
        });
    }

    // Check Persistencia
    const checkPersist = document.getElementById('c16-persistence');
    if(checkPersist) {
        checkPersist.addEventListener('change', checkLaunchReady);
    }

    function checkLaunchReady() {
        const isVisDone = document.getElementById('btn-visualize-16').disabled;
        const isPersistChecked = document.getElementById('c16-persistence').checked;
        const plan = document.getElementById('c16-plan').value;

        // Validamos que todo esté listo para mostrar el botón final
        if (isVisDone && isPersistChecked && plan.length > 5) {
            document.getElementById('finish-chap-16').classList.remove('hidden');
            // Scroll automático hacia el botón para que el usuario lo vea
            document.getElementById('finish-chap-16').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // --- GUARDAR Y AVANZAR ---
    const finishBtn = document.getElementById('finish-chap-16');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Lanzando...";
            finishBtn.disabled = true;
            
            goalData.plan = document.getElementById('c16-plan').value;
            goalData.createdAt = new Date();

            try {
                const uid = auth.currentUser.uid;
                
                await updateDoc(doc(db, "usuarios", uid), {
                    nivelActual: 17, // Desbloquea Cap 17
                    cap16Completed: new Date(),
                    currentMajorGoal: goalData 
                });

                alert("¡COHETE EN ÓRBITA! Pasando al Módulo de Tiempo...");
                
                // Actualizar Sidebar
                updateSidebarProgress(17);
                
                // 2. CAMBIO DE VISTA AUTOMÁTICO (Esto era lo que faltaba)
                // Activamos visualmente el item del menú
                document.querySelectorAll('.module-item').forEach(i => i.classList.remove('active'));
                const nextItem = document.querySelector(`.module-item[data-chapter="17"]`);
                if(nextItem) nextItem.classList.add('active');

                // Cambiamos la pantalla central
                showChapterView(17);

            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
                finishBtn.textContent = "Reintentar Lanzamiento";
                finishBtn.disabled = false;
            }
        });
    }
}