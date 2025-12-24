// js/chapters/chapter20.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter20() {
    
    // --- 1. REENCUADRE ---
    const box = document.getElementById('reframing-box');
    const display = document.getElementById('word-display');
    const meaning = document.getElementById('word-meaning');
    const lock2 = document.getElementById('lock-20-2');
    const sec2 = document.getElementById('storm-section');

    const states = {
        'PROBLEMA': { class: 'state-problem', text: 'Algo con lo que se lucha. (Estrés alto)' },
        'SITUACIÓN': { class: 'state-situation', text: 'Un hecho neutral. Algo con lo que se trata.' },
        'DESAFÍO': { class: 'state-challenge', text: 'Algo que saca lo mejor de ti. (Positivo)' },
        'OPORTUNIDAD': { class: 'state-opportunity', text: 'La semilla de un beneficio mayor. (Genialidad)' }
    };

    window.setWord = function(word) {
        display.textContent = word;
        meaning.textContent = states[word].text;
        
        // Limpiar clases anteriores
        box.classList.remove('state-problem', 'state-situation', 'state-challenge', 'state-opportunity');
        box.classList.add(states[word].class);

        // Si llega a Oportunidad, desbloquear fase 2
        if (word === 'OPORTUNIDAD') {
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    };

    // --- 2. TORMENTA MENTAL (20 Ideas) ---
    const qInput = document.getElementById('storm-question');
    const iInput = document.getElementById('idea-input');
    const btnAdd = document.getElementById('btn-add-idea');
    const list = document.getElementById('ideas-list');
    const countDisplay = document.getElementById('ideas-count');
    const circle = document.querySelector('.counter-circle');
    const finishBtn = document.getElementById('finish-chap-20');

    let ideasCount = 0;
    const TARGET_IDEAS = 20;

    // Activar input de ideas cuando haya pregunta
    if (qInput) {
        qInput.addEventListener('input', (e) => {
            if (e.target.value.length > 5) {
                iInput.disabled = false;
                btnAdd.disabled = false;
                circle.classList.add('active');
            } else {
                iInput.disabled = true;
                btnAdd.disabled = true;
                circle.classList.remove('active');
            }
        });
    }

    // Agregar Idea
    const addIdea = () => {
        const text = iInput.value.trim();
        if (!text) return;

        ideasCount++;
        countDisplay.textContent = ideasCount;
        
        // Crear elemento
        const div = document.createElement('div');
        div.className = 'idea-item';
        
        if (ideasCount > 10) div.classList.add('hard');
        if (ideasCount === 20) div.classList.add('gold');

        div.innerHTML = `
            <span class="idea-num">#${ideasCount}</span>
            <span class="idea-text">${text}</span>
        `;
        
        list.prepend(div); // Agregar al principio
        iInput.value = '';
        iInput.focus();

        // Verificar meta
        if (ideasCount >= TARGET_IDEAS) {
            circle.classList.add('complete');
            finishBtn.classList.remove('hidden');
            iInput.placeholder = "¡20 Ideas logradas! Eres un genio.";
        } else if (ideasCount === 10) {
            alert("Vas a la mitad. Ahora empieza lo difícil. Sigue.");
        }
    };

    if (btnAdd) {
        btnAdd.addEventListener('click', addIdea);
        iInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addIdea();
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Soluciones...";
            try {
                // Recopilar ideas (opcional, por ahora solo el conteo)
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 21,
                    cap20Completed: new Date(),
                    preguntaCreativa: qInput.value,
                    totalIdeasGeneradas: ideasCount
                });
                alert("¡Genio Activado! Has forzado a tu mente a darte respuestas.");
                updateSidebarProgress(21);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}