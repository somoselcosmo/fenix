// js/chapters/chapter7.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter7() {
    
    // --- 1. SÍNTOMAS ---
    window.toggleSymptom = function(btn) {
        btn.classList.toggle('selected');
        document.getElementById('symptom-feedback').classList.remove('hidden');
    };

    // --- 2. SISTEMA DE CADENAS ---
    let currentChainId = null;
    const chainsData = {
        1: { title: "Perdonar a los Padres", desc: "Ellos hicieron lo mejor que pudieron con lo que tenían. Eran víctimas de víctimas. Déjalos ir." },
        2: { title: "Perdonar a los Demás", desc: "El rencor es un carbón ardiendo que agarras para tirárselo a otro, pero te quemas tú. Suéltalo." },
        3: { title: "Perdonar a Uno Mismo", desc: "Deja de cargar con culpas pasadas. Eres humano. Acepta, aprende y avanza." },
        4: { title: "Pedir Perdón", desc: "Si has herido a alguien, asume la responsabilidad. Libérate de la deuda moral." }
    };

    let chainsBroken = 0;
    const TOTAL_CHAINS = 4;

    // Abrir Modal
    window.openForgivenessModal = function(id) {
        currentChainId = id;
        const data = chainsData[id];
        
        document.getElementById('forgive-title').textContent = data.title;
        document.getElementById('forgive-desc').textContent = data.desc;
        document.getElementById('forgive-input').value = ""; // Limpiar
        
        document.getElementById('forgiveness-modal').classList.remove('hidden');
        document.getElementById('forgive-input').focus();
    };

    // Cerrar Modal
    window.closeForgivenessModal = function() {
        document.getElementById('forgiveness-modal').classList.add('hidden');
    };

    // Validar Input del Mantra
    const input = document.getElementById('forgive-input');
    if (input) {
        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase();
            
            if (val === "PERDONO Y OLVIDO") {
                // ÉXITO: Romper cadena
                input.blur();
                closeForgivenessModal();
                breakChain(currentChainId);
            }
        });
    }

    function breakChain(id) {
        const chainEl = document.getElementById(`chain-${id}`);
        if (chainEl && !chainEl.classList.contains('broken')) {
            // Animación y sonido mental
            chainEl.classList.add('broken');
            chainsBroken++;

            // Guardar progreso parcial (opcional)
            saveChainProgress(id);

            // Verificar victoria
            if (chainsBroken === TOTAL_CHAINS) {
                setTimeout(() => {
                    document.querySelector('.chains-container').classList.add('unlocked');
                    document.getElementById('finish-chap-7-container').classList.remove('hidden');
                    // Scroll al botón final
                    document.getElementById('finish-chap-7-container').scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }
        }
    }

    async function saveChainProgress(chainId) {
        try {
            await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
                [`cap7_chain_${chainId}`]: true
            }, { merge: true });
        } catch (e) { console.error(e); }
    }

    // Restaurar progreso al cargar (para que no aparezcan cadenas rotas si ya las rompió)
    // Nota: Esto requeriría leer la DB al inicio, por simplicidad ahora solo lo hacemos en sesión.
    // Si quieres persistencia total visual, avísame para agregar la función de lectura.

    // --- 3. FINALIZAR ---
    const finishBtn = document.getElementById('finish-chap-7');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Libertad...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 8, // Desbloquea Cap 8
                    cap7Completed: new Date()
                });
                alert("¡Frenos Liberados! Has recuperado el control total.");
                updateSidebarProgress(8);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}