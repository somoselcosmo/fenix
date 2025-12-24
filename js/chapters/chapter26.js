// js/chapters/chapter26.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter26() {
    
    // --- 1. DEFENSA (Escudo) ---
    const defenseSys = document.querySelector('.defense-system');
    const shieldVis = document.getElementById('shield-visual');
    const lock2 = document.getElementById('lock-26-2');
    const sec2 = document.getElementById('nutrition-section');

    window.toggleShield = function() {
        const sw = document.getElementById('switch-shield');
        
        if (sw.checked) {
            shieldVis.classList.add('active');
            defenseSys.classList.add('protected'); // CSS cambia la animación de amenazas
            
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1500);
        } else {
            shieldVis.classList.remove('active');
            defenseSys.classList.remove('protected');
        }
    };

    // --- 2. NUTRICIÓN (Tamagotchi Style) ---
    const tree = document.getElementById('tree-growth');
    const bar = document.getElementById('growth-bar');
    const lock3 = document.getElementById('lock-26-3');
    const sec3 = document.getElementById('reset-section');
    
    let growthLevel = 0;
    
    window.feedChild = function(type) {
        if (growthLevel >= 100) return;

        // Feedback visual
        growthLevel += 10;
        bar.style.width = `${growthLevel}%`;
        
        // El niño crece
        const scale = 1 + (growthLevel / 50); // De 1 a 3
        tree.style.transform = `scale(${scale})`;
        
        // Cambia de semilla a árbol
        if (growthLevel > 30) tree.textContent = "🌿";
        if (growthLevel > 60) tree.textContent = "🌳";
        if (growthLevel >= 100) {
            tree.textContent = "🦸"; // Super Niño
            
            setTimeout(() => {
                if(sec3.classList.contains('locked')) {
                    sec3.classList.remove('locked');
                    lock3.style.display = 'none';
                    sec3.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    };

    // --- 3. PERDÓN (Guardar) ---
    const btnSign = document.getElementById('btn-sign-apology');
    
    if (btnSign) {
        btnSign.addEventListener('click', async () => {
            btnSign.textContent = "Pacto Sellado...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 27, // Fin del curso?
                    cap26Completed: new Date(),
                    pactoCrianza: true
                });
                alert("¡Has sembrado el futuro! Módulo Completado.");
                updateSidebarProgress(27);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}