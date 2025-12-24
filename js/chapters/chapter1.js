// js/chapters/chapter1.js
import { auth, db } from '../firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';
import { showChapterView } from '../core/router.js';

export function initChapter1() {
    // CALCULADORA
    const sliderC = document.getElementById('slider-c');
    const sliderE = document.getElementById('slider-e');
    
    if(sliderC && sliderE) {
        function calc() {
            const c = parseInt(sliderC.value);
            const e = parseInt(sliderE.value);
            const r = c * e;
            document.getElementById('val-c').textContent = c;
            document.getElementById('val-e').textContent = e;
            document.getElementById('bar-r').style.width = `${r}%`;
            
            const feedback = document.getElementById('formula-feedback');
            if(r < 30) { feedback.textContent = "Resultados pobres."; feedback.style.color = "#ef4444"; }
            else if(r > 80) { feedback.textContent = "¡EXCELENCIA!"; feedback.style.color = "#22c55e"; }
            else { feedback.textContent = "Puedes mejorar."; feedback.style.color = "#fff"; }
        }
        sliderC.addEventListener('input', calc);
        sliderE.addEventListener('input', calc);
        calc();
    }

    // CONTRATO
    const signInput = document.getElementById('signature-input');
    const signBtn = document.getElementById('sign-contract-btn');

    if(signInput) {
        signInput.addEventListener('input', (e) => {
            signBtn.disabled = e.target.value.length < 3;
        });

        signBtn.addEventListener('click', async () => {
            signBtn.textContent = "Guardando...";
            signBtn.disabled = true;
            try {
                await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 2,
                    fechaFirma: new Date()
                }, { merge: true });

                alert("¡Nivel 2 Desbloqueado!");
                updateSidebarProgress(2);
                showChapterView(2);
                
                // Activar visualmente el 2 en el menú
                document.querySelectorAll('.module-item').forEach(i => i.classList.remove('active'));
                document.querySelector('.module-item[data-chapter="2"]').classList.add('active');

            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
                signBtn.disabled = false;
            }
        });
    }
}