// js/chapters/chapter24.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter24() {
    
    // --- 1. DIAGNÓSTICO ---
    const batteryJuice = document.getElementById('social-juice');
    const batteryStatus = document.getElementById('social-status');
    const lock2 = document.getElementById('lock-24-2');
    const sec2 = document.getElementById('indirect-section');

    window.calcSocialBattery = function() {
        const sliders = document.querySelectorAll('.social-slider');
        let total = 0;
        sliders.forEach(s => total += parseInt(s.value));
        
        // Promedio (0 a 100)
        const avg = total / sliders.length;
        
        batteryJuice.style.height = `${avg}%`;
        
        if (avg < 40) {
            batteryJuice.style.backgroundColor = "#ef4444";
            batteryJuice.style.boxShadow = "0 0 15px #ef4444";
            batteryStatus.textContent = "Energía Magnética: BAJA (Repulsiva)";
            batteryStatus.style.color = "#ef4444";
        } else if (avg < 80) {
            batteryJuice.style.backgroundColor = "#f59e0b";
            batteryJuice.style.boxShadow = "0 0 15px #f59e0b";
            batteryStatus.textContent = "Energía Magnética: MEDIA";
            batteryStatus.style.color = "#f59e0b";
        } else {
            batteryJuice.style.backgroundColor = "#22c55e";
            batteryJuice.style.boxShadow = "0 0 15px #22c55e";
            batteryStatus.textContent = "Energía Magnética: ALTA (Atractiva)";
            batteryStatus.style.color = "#22c55e";
            
            // Desbloquear fase 2
            setTimeout(() => {
                if(sec2.classList.contains('locked')) {
                    sec2.classList.remove('locked');
                    lock2.style.display = 'none';
                    sec2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    };

    // --- 2. ESFUERZO INDIRECTO ---
    const visual = document.getElementById('magnet-visual');
    const feedback = document.getElementById('magnet-feedback');
    const lock3 = document.getElementById('lock-24-3');
    const sec3 = document.getElementById('seven-keys-section');

    window.setMagnetMode = function(mode) {
        visual.classList.remove('repel', 'attract');
        
        // Reset botones
        document.querySelectorAll('.magnet-mode-btn').forEach(b => b.classList.remove('active'));
        // (En una implementación real pasaríamos 'this', aquí simplificamos buscando por texto o índice)
        // Por simplicidad visual, asumimos el cambio.

        void visual.offsetWidth; // Reflow

        if (mode === 'direct') {
            visual.classList.add('repel');
            feedback.textContent = "Intentas impresionar -> Ellos se alejan (Resistencia).";
            feedback.style.color = "#ef4444";
        } else {
            visual.classList.add('attract');
            feedback.textContent = "Te interesas en ellos -> Ellos vienen a ti (Aceptación).";
            feedback.style.color = "#22c55e";
            
            setTimeout(() => {
                if(sec3.classList.contains('locked')) {
                    sec3.classList.remove('locked');
                    lock3.style.display = 'none';
                    sec3.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1500);
        }
    };

    // --- 3. GIMNASIO SOCIAL ---
    let gymProgress = { smile: false, listen: false, thanks: false };
    const finishBtn = document.getElementById('finish-chap-24');
    const boomerang = document.getElementById('boomerang-container');

    // A. Sonrisa
    const btnSmile = document.getElementById('btn-smile');
    if(btnSmile) {
        btnSmile.addEventListener('click', () => {
            btnSmile.textContent = "😊 SONRIENDO...";
            btnSmile.style.backgroundColor = "#f59e0b";
            setTimeout(() => {
                btnSmile.textContent = "✅ ACEPTACIÓN ENVIADA";
                btnSmile.disabled = true;
                btnSmile.style.backgroundColor = "#22c55e";
                gymProgress.smile = true;
                checkAllGym();
            }, 1000);
        });
    }

    // B. Escucha (Hold Button)
    const btnListen = document.getElementById('btn-listen');
    const bar = document.getElementById('listening-bar');
    let listenInterval;
    let listenVal = 0;

    if(btnListen) {
        const startListening = (e) => {
            e.preventDefault();
            if (gymProgress.listen) return;
            btnListen.textContent = "👂 ESCUCHANDO (No interrumpas)...";
            listenInterval = setInterval(() => {
                listenVal += 2;
                bar.style.width = `${listenVal}%`;
                if (listenVal >= 100) {
                    clearInterval(listenInterval);
                    btnListen.textContent = "✅ ATENCIÓN COMPLETADA";
                    btnListen.disabled = true;
                    btnListen.style.backgroundColor = "#22c55e";
                    gymProgress.listen = true;
                    checkAllGym();
                }
            }, 50); // 2.5 segundos
        };

        const stopListening = () => {
            if (gymProgress.listen) return;
            clearInterval(listenInterval);
            listenVal = 0;
            bar.style.width = "0%";
            btnListen.textContent = "❌ INTERRUMPISTE (Inténtalo de nuevo)";
            setTimeout(() => btnListen.textContent = "👂 MANTENER ESCUCHA", 1000);
        };

        btnListen.addEventListener('mousedown', startListening);
        btnListen.addEventListener('touchstart', startListening);
        btnListen.addEventListener('mouseup', stopListening);
        btnListen.addEventListener('mouseleave', stopListening);
        btnListen.addEventListener('touchend', stopListening);
    }

    // C. Gratitud
    const btnThanks = document.getElementById('btn-thanks');
    const inputThanks = document.getElementById('thanks-input');
    if(btnThanks) {
        btnThanks.addEventListener('click', () => {
            if(inputThanks.value.length < 3) return alert("Escribe algo.");
            btnThanks.textContent = "Enviado";
            btnThanks.disabled = true;
            gymProgress.thanks = true;
            checkAllGym();
        });
    }

    function checkAllGym() {
        if (gymProgress.smile && gymProgress.listen && gymProgress.thanks) {
            boomerang.classList.remove('hidden');
            setTimeout(() => {
                finishBtn.classList.remove('hidden');
                finishBtn.scrollIntoView({ behavior: 'smooth' });
            }, 2500); // Esperar animación boomerang
        }
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando Personalidad...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 25,
                    cap24Completed: new Date()
                });
                alert("¡Carisma Magnético Activado! Estás listo para liderar.");
                updateSidebarProgress(25);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}