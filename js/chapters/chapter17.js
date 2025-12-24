// js/chapters/chapter17.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter17() {
    
    // --- 1. PARETO (80/20) ---
    const paretoContainer = document.getElementById('pareto-container');
    const lock2 = document.getElementById('lock-17-2');
    const sec2 = document.getElementById('abcde-section');

    if (paretoContainer) {
        // Generar 10 bloques
        paretoContainer.innerHTML = '';
        for(let i=0; i<10; i++) {
            const div = document.createElement('div');
            div.className = 'pareto-block';
            div.innerHTML = i+1;
            paretoContainer.appendChild(div);
        }

        window.applyPareto = function() {
            const blocks = document.querySelectorAll('.pareto-block');
            blocks.forEach((block, index) => {
                if (index < 2) { // El 20% (2 de 10)
                    block.classList.add('vital');
                    block.textContent = "20%";
                } else {
                    block.classList.add('trivial');
                    block.textContent = "80%";
                }
            });

            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        };
    }

    // --- 2. GESTOR DE TAREAS ABCDE ---
    const taskInput = document.getElementById('new-task-input');
    const tasksList = document.getElementById('tasks-list');
    const legend = document.getElementById('abcde-legend');
    const btnSort = document.getElementById('btn-sort-tasks');
    const lock3 = document.getElementById('lock-17-3');
    const sec3 = document.getElementById('procrastination-section');

    // Array en memoria para las tareas
    let tasks = [];

    window.addTaskToList = function() {
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.push({ id: Date.now(), text: text, priority: 'none' });
        taskInput.value = '';
        renderTasks();
        
        legend.classList.remove('hidden');
        btnSort.classList.remove('hidden');
    };

    // Permitir Enter para agregar
    if(taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') addTaskToList();
        });
    }

    // Renderizado dinámico
    function renderTasks() {
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p class="empty-msg">Tu lista está vacía.</p>';
            return;
        }

        tasksList.innerHTML = tasks.map(task => `
            <div class="task-item priority-${task.priority}" id="task-${task.id}">
                <span class="task-text">${task.text}</span>
                <select class="priority-select" onchange="updatePriority(${task.id}, this.value)">
                    <option value="none" ${task.priority === 'none' ? 'selected' : ''}>-</option>
                    <option value="A" ${task.priority === 'A' ? 'selected' : ''}>A</option>
                    <option value="B" ${task.priority === 'B' ? 'selected' : ''}>B</option>
                    <option value="C" ${task.priority === 'C' ? 'selected' : ''}>C</option>
                    <option value="D" ${task.priority === 'D' ? 'selected' : ''}>D</option>
                    <option value="E" ${task.priority === 'E' ? 'selected' : ''}>E</option>
                </select>
            </div>
        `).join('');
    }

    // Función global para actualizar prioridad
    window.updatePriority = function(id, val) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.priority = val;
            renderTasks(); // Re-render para aplicar colores
        }
    };

    // ALGORITMO DE ORDENAMIENTO (El cerebro del módulo)
    window.sortTasksABCDE = function() {
        // Verificar si hay al menos una A
        const hasA = tasks.some(t => t.priority === 'A');
        if (!hasA) return alert("Debes marcar al menos una tarea como 'A' (Vital).");

        // Ordenar: A, B, C, D, E, None
        const priorityOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'none': 6 };
        
        tasks.sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        renderTasks();
        alert("Lista reordenada. ¡Empieza por la A-1!");

        // Desbloquear siguiente
        setTimeout(() => {
            if(sec3.classList.contains('locked')) {
                sec3.classList.remove('locked');
                lock3.style.display = 'none';
                sec3.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    };

    // --- 3. ANTI-DILACIÓN ---
    const btnDoIt = document.getElementById('btn-do-it');
    const mantraDisplay = document.getElementById('mantra-display');
    const finishBtn = document.getElementById('finish-chap-17');
    
    let clickCount = 0;
    const TARGET_CLICKS = 5; // Clics rápidos para activar energía

    if (btnDoIt) {
        btnDoIt.addEventListener('click', () => {
            clickCount++;
            
            // Efecto visual frenético
            mantraDisplay.textContent = "¡HAZLO AHORA!";
            mantraDisplay.style.color = clickCount % 2 === 0 ? "#ef4444" : "#fff";
            mantraDisplay.style.transform = `scale(${1 + clickCount/10})`;

            if (clickCount >= TARGET_CLICKS) {
                btnDoIt.disabled = true;
                btnDoIt.textContent = "INERCIA ROTA";
                btnDoIt.style.background = "#22c55e";
                mantraDisplay.style.color = "#22c55e";
                mantraDisplay.textContent = "¡ACCIÓN MASIVA!";
                
                finishBtn.classList.remove('hidden');
            }
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Plan...";
            
            // Filtramos las tareas E (Eliminadas) para no guardarlas
            const activeTasks = tasks.filter(t => t.priority !== 'E');

            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 18,
                    cap17Completed: new Date(),
                    toDoList: activeTasks // Guardamos la lista ordenada
                });
                alert("¡Plan Maestro Guardado! Trabaja en tu A-1.");
                updateSidebarProgress(18);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}