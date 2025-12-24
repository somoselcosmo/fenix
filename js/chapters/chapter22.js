// js/chapters/chapter22.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

export function initChapter22() {
    
    // --- 1. SIMULACIÓN DE ENERGÍA ---
    const btnGen = document.getElementById('btn-generate-energy');
    const lPhysical = document.getElementById('liquid-physical');
    const lEmotional = document.getElementById('liquid-emotional');
    const lMental = document.getElementById('liquid-mental');
    const lPsychic = document.getElementById('liquid-psychic');
    const emotionalTank = document.querySelector('.tank-level.emotional');
    const status = document.getElementById('refinery-status');
    
    const lock2 = document.getElementById('lock-22-2');
    const sec2 = document.getElementById('repair-section');

    let isLeaking = true;
    let patchesApplied = 0;

    if (btnGen) {
        btnGen.addEventListener('click', () => {
            btnGen.disabled = true;
            status.textContent = "Inyectando calorías...";
            
            // 1. Llena Físico
            lPhysical.style.height = "100%";
            
            setTimeout(() => {
                // 2. Sube a Emocional
                lEmotional.style.height = "100%";
                
                if (isLeaking) {
                    // FUGA ACTIVA
                    emotionalTank.classList.add('leaking');
                    status.textContent = "ALERTA: Fuga en nivel emocional (Negatividad).";
                    status.style.color = "#ef4444";
                    
                    // La energía se queda ahí y no sube
                    setTimeout(() => {
                        status.textContent += " La energía se ha disipado.";
                        // Desbloquear reparación
                        if(sec2.classList.contains('locked')) {
                            sec2.classList.remove('locked');
                            lock2.style.display = 'none';
                            sec2.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1500);

                } else {
                    // REPARADO: Sube a Mental
                    emotionalTank.classList.remove('leaking');
                    status.textContent = "Nivel Emocional Estable. Subiendo...";
                    status.style.color = "#fff";

                    setTimeout(() => {
                        lMental.style.height = "100%";
                        
                        setTimeout(() => {
                            lPsychic.style.height = "100%";
                            document.getElementById('psychic-glow').classList.remove('hidden');
                            status.textContent = "¡FLUJO COMPLETO! Genialidad activada.";
                            status.style.color = "#a855f7";
                            
                            // Desbloquear fase 3
                            const lock3 = document.getElementById('lock-22-3');
                            const sec3 = document.getElementById('environment-section');
                            sec3.classList.remove('locked');
                            lock3.style.display = 'none';
                            sec3.scrollIntoView({ behavior: 'smooth' });

                        }, 1000);
                    }, 1000);
                }
            }, 1000);
        });
    }

    // --- 2. REPARACIÓN (Parches) ---
    window.applyPatch = function(type) {
        // Encontrar botón (esto es un hack rápido, idealmente pasar 'this')
        // Buscamos por texto o atributo, pero mejor usar la clase y estado
        // Simplemente contamos parches globales
        
        // Efecto visual en el botón que se hizo click (necesitamos pasar 'this' en HTML o buscarlo)
        // Para simplificar, asumimos que el usuario hace click y cambiamos el estado visual
        const btns = document.querySelectorAll('.patch-btn');
        let clickedBtn;
        
        // Identificar botón por texto aproximado (o pasar 'this' en html es mejor)
        // Vamos a asumir que el usuario sigue instrucciones.
        
        // Mejor implementación:
        // En el HTML: onclick="applyPatch(this)"
        // Actualiza el HTML arriba: onclick="applyPatch(this)"
    };
    
    // CORRECCIÓN DE LA FUNCIÓN APPLYPATCH (Usar 'el' como argumento)
    // Nota: Debes actualizar el HTML para pasar 'this': onclick="applyPatch(this)"
    window.applyPatch = function(el) {
        if (el.classList.contains('applied')) return;
        
        el.classList.add('applied');
        el.textContent = "PARCHE APLICADO";
        patchesApplied++;

        if (patchesApplied === 3) {
            isLeaking = false;
            status.textContent = "Fuga sellada. Reiniciando sistema...";
            status.style.color = "#22c55e";
            
            // Resetear niveles para mostrar el flujo correcto
            lPhysical.style.height = "0%";
            lEmotional.style.height = "0%";
            emotionalTank.classList.remove('leaking');
            
            setTimeout(() => {
                btnGen.disabled = false;
                btnGen.textContent = "⚡ REINICIAR GENERACIÓN";
                btnGen.click(); // Auto-click para mostrar el éxito
            }, 1500);
        }
    };
    // **NOTA: En el HTML anterior puse onclick="applyPatch('tipo')". 
    // Cámbialo a onclick="applyPatch(this)" para que funcione este código.**

    // --- 3. AISLAMIENTO ---
    window.checkIsolation = function() {
        const sw = document.getElementById('switch-isolate');
        const finishBtn = document.getElementById('finish-chap-22');
        
        if (sw.checked) {
            finishBtn.classList.remove('hidden');
            finishBtn.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- GUARDAR ---
    const finishBtn = document.getElementById('finish-chap-22');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            finishBtn.textContent = "Refinando...";
            try {
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
                    nivelActual: 23,
                    cap22Completed: new Date()
                });
                alert("¡Alquimia Completada! Energía creativa al máximo.");
                updateSidebarProgress(23);
            } catch (e) {
                console.error(e);
                alert("Error al guardar.");
            }
        });
    }
}