// js/chapters/chapter12.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter12() {
    
    // --- 1. TERMINAL (Escritura) ---
    const cmdInput = document.getElementById('daily-goal-input');
    const btnSaveCmd = document.getElementById('btn-save-cmd');
    const feedback = document.getElementById('cmd-feedback');
    const lock2 = document.getElementById('lock-12-2');
    const sec2 = document.getElementById('stop-section');

    if (btnSaveCmd) {
        btnSaveCmd.addEventListener('click', async () => {
            if (cmdInput.value.length < 5) return alert("Escribe una meta real.");
            
            btnSaveCmd.textContent = "EJECUTANDO...";
            
            // Simular proceso de escritura en disco
            setTimeout(() => {
                feedback.classList.remove('hidden');
                cmdInput.disabled = true;
                btnSaveCmd.textContent = "COMANDO GUARDADO";
                btnSaveCmd.disabled = true;
                
                // Desbloquear
                setTimeout(() => {
                    if(sec2.classList.contains('locked')) {
                        sec2.classList.remove('locked');
                        lock2.style.display = 'none';
                        sec2.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);
            }, 1000);
        });
    }

    // --- 2. FRENO DE EMERGENCIA (Stop) ---
    const disk = document.getElementById('negative-disk');
    const btnStop = document.getElementById('btn-stop');
    const lock3 = document.getElementById('lock-12-3');
    const sec3 = document.getElementById('flow-section');

    if (btnStop) {
        btnStop.addEventListener('click', () => {
            // Detener disco de golpe
            disk.classList.remove('spinning');
            disk.classList.add('stopped');
            
            // Efecto de sonido visual (vibración)
            document.body.style.backgroundColor = "#fff";
            setTimeout(() => document.body.style.backgroundColor = "", 50);

            btnStop.textContent = "PENSAMIENTO DETENIDO";
            btnStop.disabled = true;
            
            setTimeout(() => {
                if(sec3.classList.contains('locked')) {
                    sec3.classList.remove('locked');
                    lock3.style.display = 'none';
                    sec3.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }

    // --- 3. LEY DE RELAJACIÓN (Orbe de Flujo) ---
    const orb = document.getElementById('flow-orb');
    const bar = document.getElementById('flow-bar');
    const status = document.getElementById('flow-status');
    const finishBtn = document.getElementById('finish-chap-12');
    
    let flowProgress = 0;
    let isHovering = false;
    let flowInterval;

    if (orb) {
        // El usuario debe poner el mouse encima y NO moverse bruscamente ni hacer clic
        orb.addEventListener('mouseenter', () => {
            isHovering = true;
            status.textContent = "Estado: Fluyendo...";
            status.style.color = "#3b82f6";
            
            flowInterval = setInterval(() => {
                if (!isHovering) return;
                
                flowProgress += 1;
                bar.style.width = `${flowProgress}%`;
                
                // Efecto visual de crecimiento
                if(flowProgress % 10 === 0) {
                    const scale = 1 + (flowProgress / 200);
                    orb.style.transform = `scale(${scale})`;
                }

                if (flowProgress >= 100) {
                    successFlow();
                }
            }, 50); // Llenado lento y suave
        });

        orb.addEventListener('mouseleave', () => {
            isHovering = false;
            clearInterval(flowInterval);
            if (flowProgress < 100) {
                status.textContent = "Estado: Interrupción (Reiniciando)";
                status.style.color = "#ef4444";
                flowProgress = 0;
                bar.style.width = "0%";
                orb.style.transform = "scale(1)";
            }
        });

        // Si hace clic, PIERDE (El esfuerzo vence al resultado)
        orb.addEventListener('mousedown', () => {
            if (flowProgress >= 100) return;
            isHovering = false;
            clearInterval(flowInterval);
            flowProgress = 0;
            bar.style.width = "0%";
            orb.style.transform = "scale(1)";
            status.textContent = "Estado: ¡Demasiado Esfuerzo! (Relájate, solo observa)";
            status.style.color = "#ef4444";
            
            // Pequeña sacudida de error
            orb.style.borderColor = "#ef4444";
            setTimeout(() => orb.style.borderColor = "rgba(59, 130, 246, 0.5)", 500);
        });
    }

    function successFlow() {
        clearInterval(flowInterval);
        orb.classList.add('flowing');
        status.textContent = "Estado: FLUJO TOTAL ALCANZADO";
        status.style.color = "#22c55e";
        finishBtn.classList.remove('hidden');
    }

    // --- GUARDAR ---
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Guardando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 13,
                    cap12Completed: new Date()
                });
                alert("¡Software Instalado! Tu cerebro está optimizado.");
                updateSidebarProgress(13);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}