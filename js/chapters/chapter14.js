// js/chapters/chapter14.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter14() {
    
    // --- 1. MEDITACIÓN (Respiración) ---
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    const btnMed = document.getElementById('btn-start-meditation');
    const lock2 = document.getElementById('lock-14-2');
    const sec2 = document.getElementById('studio-section');

    if (btnMed) {
        btnMed.addEventListener('click', () => {
            btnMed.disabled = true;
            btnMed.textContent = "Respirando...";
            
            let cycles = 0;
            const maxCycles = 2; // Corto para demo (en prod poner más)

            const breathLoop = () => {
                // INHALA (4s)
                circle.classList.add('inhale');
                circle.classList.remove('exhale');
                text.textContent = "INHALA";

                setTimeout(() => {
                    // EXHALA (4s)
                    circle.classList.remove('inhale');
                    circle.classList.add('exhale');
                    text.textContent = "UNO..."; // Mantra Harvard

                    setTimeout(() => {
                        cycles++;
                        if (cycles < maxCycles) {
                            breathLoop();
                        } else {
                            // FIN
                            text.textContent = "ALFA";
                            btnMed.textContent = "Estado Alfa Alcanzado";
                            btnMed.style.background = "#22c55e";
                            
                            setTimeout(() => {
                                sec2.classList.remove('locked');
                                lock2.style.display = 'none';
                                sec2.scrollIntoView({ behavior: 'smooth' });
                            }, 1000);
                        }
                    }, 4000);
                }, 4000);
            };

            breathLoop();
        });
    }

    // --- 2. CONSOLA (Yo -> Usted) ---
    const input = document.getElementById('tape-input');
    const output = document.getElementById('tape-output');
    const btnRec = document.getElementById('btn-record');
    const lock3 = document.getElementById('lock-14-3');
    const sec3 = document.getElementById('player-section');
    const preview = document.getElementById('tape-content-preview');

    if (btnRec) {
        btnRec.addEventListener('click', () => {
            const rawText = input.value.trim();
            
            if (rawText.length < 5) return alert("Escribe una afirmación real.");
            if (!rawText.toLowerCase().startsWith("yo")) return alert("Empieza con 'Yo' (Ej: Yo soy feliz).");

            // MAGIA: Transformar "Yo" -> "Usted"
            // Reemplazo simple (se puede mejorar con Regex para gramática compleja)
            let processedText = rawText.replace(/yo/gi, "USTED");
            // Ajustes comunes de verbos (muy básico, para demo funciona)
            processedText = processedText.replace(/soy/gi, "ES");
            processedText = processedText.replace(/tengo/gi, "TIENE");
            processedText = processedText.replace(/puedo/gi, "PUEDE");
            processedText = processedText.replace(/merezco/gi, "MERECE");

            // Mostrar en pantalla verde
            output.textContent = `> GRABANDO: "${processedText.toUpperCase()}"`;
            
            btnRec.classList.add('pulsing');
            btnRec.textContent = "GRABANDO...";

            setTimeout(() => {
                btnRec.classList.remove('pulsing');
                btnRec.textContent = "GRABACIÓN COMPLETADA";
                btnRec.disabled = true;
                btnRec.style.background = "#22c55e";
                
                // Pasar el texto a la etiqueta del cassette
                preview.textContent = processedText.toUpperCase();

                // Desbloquear player
                setTimeout(() => {
                    sec3.classList.remove('locked');
                    lock3.style.display = 'none';
                    sec3.scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }, 2000);
        });
    }

    // --- 3. REPRODUCTOR ---
    const btnPlay = document.getElementById('btn-play-tape');
    const cassette = document.querySelector('.cassette');
    const waves = document.getElementById('music-waves');
    const finishBtn = document.getElementById('finish-chap-14');

    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            if (btnPlay.textContent.includes("PAUSA")) return; // Simple toggle logic could be added

            cassette.classList.add('playing');
            waves.classList.remove('hidden');
            btnPlay.textContent = "🔊 REPRODUCIENDO (Siente la música)...";
            btnPlay.disabled = true;

            // Simular sesión de 5 segundos
            setTimeout(() => {
                cassette.classList.remove('playing');
                waves.classList.add('hidden');
                btnPlay.textContent = "SESIÓN FINALIZADA";
                finishBtn.classList.remove('hidden');
            }, 5000);
        });
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Cinta...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 15,
                    cap14Completed: new Date(),
                    mensajeHeterogeneo: preview.textContent
                });
                alert("¡Cinta Maestra Guardada! Escúchala a diario.");
                updateSidebarProgress(15);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}