// js/chapters/chapter6.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter6() {
    
    // ESTADO DEL JUEGO
    let rootsCut = { justification: false, identification: false };
    let treeHealth = 100;
    
    const tree = document.getElementById('negative-tree');
    const healthBar = document.getElementById('tree-health');
    const axeBtn = document.getElementById('axe-btn');
    const instruction = document.getElementById('axe-instruction');
    const victoryBox = document.getElementById('victory-message');
    const finishBtn = document.getElementById('finish-chap-6');

    // 1. LÓGICA DE RAÍCES (Global para el onclick del HTML)
    window.cutRoot = function(type) {
        const btn = document.getElementById(`root-${type}`);
        
        if (!rootsCut[type]) {
            rootsCut[type] = true;
            
            // Visualmente cortada
            btn.classList.add('cut');
            btn.classList.remove('active');
            btn.textContent = "NUTRIENTE CORTADO";
            
            checkAxeStatus();
        }
    };

    function checkAxeStatus() {
        if (rootsCut.justification && rootsCut.identification) {
            // Ambas cortadas -> Habilitar Hacha
            axeBtn.disabled = false;
            axeBtn.classList.add('ready');
            axeBtn.innerHTML = '<span class="axe-icon">🪓</span> ¡SOY RESPONSABLE!';
            instruction.textContent = "El árbol está débil. ¡DERRÍBALO AHORA!";
            instruction.style.color = "var(--accent)";
            
            // El árbol empieza a temblar un poco
            tree.style.filter = "grayscale(0)"; // Se revela para el golpe
        }
    }

    // 2. LÓGICA DEL HACHA (Golpear)
    if (axeBtn) {
        axeBtn.addEventListener('click', () => {
            if (treeHealth <= 0) return;

            // Reducir vida
            treeHealth -= 10;
            healthBar.style.width = `${treeHealth}%`;

            // Animación de golpe
            tree.classList.add('shake');
            setTimeout(() => tree.classList.remove('shake'), 200);

            // Efectos de sonido visuales (opcional cambiar texto)
            
            // Fin del juego
            if (treeHealth <= 0) {
                killTree();
            }
        });
    }

    function killTree() {
        tree.classList.add('tree-falling');
        axeBtn.disabled = true;
        axeBtn.textContent = "TRABAJO TERMINADO";
        axeBtn.classList.remove('ready');
        instruction.textContent = "";

        setTimeout(() => {
            victoryBox.classList.remove('hidden');
            // Cambiar ambiente a algo más alegre (opcional)
            document.querySelector('.tree-section').style.background = "#1e293b";
        }, 1000);
    }

    // 3. GUARDAR PROGRESO
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 7, // Desbloquea Cap 7
                    cap6Completed: new Date()
                });
                alert("¡Eres libre! Módulo 6 Completado.");
                updateSidebarProgress(7);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}