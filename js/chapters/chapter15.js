// js/chapters/chapter15.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter15() {
    
    // --- 1. VENN DIAGRAM ---
    const slider = document.getElementById('venn-slider');
    const c1 = document.getElementById('venn-1');
    const c2 = document.getElementById('venn-2');
    const c3 = document.getElementById('venn-3');
    const center = document.getElementById('venn-center');
    const valDisplay = document.getElementById('venn-val');
    const lock2 = document.getElementById('lock-15-2');
    const sec2 = document.getElementById('diamond-section');

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            valDisplay.textContent = val;

            // Movemos los círculos hacia el centro
            const offset = 50 - (val * 0.5); // De 50px a 0px
            c1.style.transform = `translate(-${offset}px, ${offset}px)`;
            c2.style.transform = `translate(${offset}px, ${offset}px)`;
            c3.style.transform = `translate(0, -${offset}px)`;

            if (val > 90) {
                center.classList.remove('hidden');
                setTimeout(() => {
                    if(sec2.classList.contains('locked')) {
                        sec2.classList.remove('locked');
                        lock2.style.display = 'none';
                        sec2.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);
            } else {
                center.classList.add('hidden');
            }
        });
    }

    // --- 2. MINERÍA (Acres de Diamantes) ---
    const mineField = document.getElementById('mining-field');
    const mineStatus = document.getElementById('mining-status');
    const lock3 = document.getElementById('lock-15-3');
    const sec3 = document.getElementById('test-section');
    
    let diamondsFound = 0;
    const TOTAL_BLOCKS = 15;
    const DIAMOND_LOCATION = Math.floor(Math.random() * TOTAL_BLOCKS); // Aleatorio

    if (mineField) {
        // Generar Bloques
        mineField.innerHTML = '';
        for(let i=0; i<TOTAL_BLOCKS; i++) {
            const block = document.createElement('div');
            block.className = 'soil-block';
            block.dataset.index = i;
            block.onclick = () => dig(block, i);
            mineField.appendChild(block);
        }
    }

    window.dig = function(block, index) {
        if (block.classList.contains('dug')) return;
        
        block.classList.add('dug');
        
        if (index === DIAMOND_LOCATION) {
            block.innerHTML = '💎';
            block.classList.add('diamond');
            mineStatus.textContent = "¡ENCONTRADO! La oportunidad estaba aquí mismo.";
            mineStatus.style.color = "#ffd700";
            
            setTimeout(() => {
                sec3.classList.remove('locked');
                lock3.style.display = 'none';
                sec3.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        } else {
            block.innerHTML = ''; // Vacío (Trabajo duro sin recompensa inmediata)
            mineStatus.textContent = "Sigue cavando. Es trabajo duro.";
        }
    };

    // --- 3. TEST RÁPIDO (30 Segundos) ---
    const btnStart = document.getElementById('btn-start-test');
    const btnNext = document.getElementById('btn-next-q');
    const qText = document.getElementById('question-text');
    const qInput = document.getElementById('answer-input');
    const timerDisplay = document.getElementById('timer-display');
    const lock4 = document.getElementById('lock-15-4');
    const sec4 = document.getElementById('ppd-section');

    const questions = [
        "1. ¿Cuáles son tus 3 valores más importantes?",
        "2. ¿Cuáles son tus 3 metas más importantes hoy?",
        "3. ¿Qué harías si te quedaran 6 meses de vida?",
        "4. ¿Qué harías si ganaras un millón de dólares?",
        "5. ¿Qué harías si supieras que no puedes fallar?"
    ];
    
    let qIndex = 0;
    let timeLeft = 30;
    let timerInterval;
    let userAnswers = [];

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            btnStart.classList.add('hidden');
            document.getElementById('question-container').style.display = 'block';
            btnNext.classList.remove('hidden');
            startQuestion();
        });

        btnNext.addEventListener('click', () => {
            saveAndNext();
        });
    }

    function startQuestion() {
        if (qIndex >= questions.length) {
            finishTest();
            return;
        }
        
        qText.textContent = questions[qIndex];
        qInput.value = "";
        qInput.focus();
        
        // Reiniciar Timer
        timeLeft = 30;
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.background = "#22c55e"; // Verde
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft < 10) timerDisplay.style.background = "#ef4444"; // Rojo
            
            if (timeLeft <= 0) {
                saveAndNext(); // Forzar siguiente si se acaba el tiempo
            }
        }, 1000);
    }

    function saveAndNext() {
        userAnswers.push({ q: questions[qIndex], a: qInput.value });
        qIndex++;
        startQuestion();
    }

    function finishTest() {
        clearInterval(timerInterval);
        alert("Test completado. Tu subconsciente ha hablado.");
        
        // Guardar respuestas en consola (o DB)
        console.log("Respuestas Test:", userAnswers);
        
        sec4.classList.remove('locked');
        lock4.style.display = 'none';
        sec4.scrollIntoView({ behavior: 'smooth' });
    }

    // --- 4. GUARDAR PPD ---
    const finishBtn = document.getElementById('finish-chap-15');
    
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            const ppd = document.getElementById('ppd-input').value;
            const date = document.getElementById('ppd-date').value;
            
            if (ppd.length < 10 || !date) return alert("Define tu meta y fecha.");

            finishBtn.textContent = "Sellando Destino...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 16,
                    cap15Completed: new Date(),
                    PPD: ppd,
                    fechaLimitePPD: date,
                    testRespuestas: userAnswers // Guardamos el test
                });
                alert("¡Arquitectura Completada! Tienes un plano de vida.");
                updateSidebarProgress(16);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}