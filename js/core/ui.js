// js/core/ui.js
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase-config.js";

// --- LOADER GLOBAL ---
export function toggleLoader(show) {
    const loader = document.getElementById('global-loader');
    if (!loader) return;
    if (show) {
        loader.classList.remove('fade-out');
    } else {
        loader.classList.add('fade-out');
    }
}

// --- CARGAR DATOS Y DEVOLVERLOS ---
export async function loadUserProfile(uid) {
    try {
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 1. Poner nombre
            const nameDisplay = document.getElementById('user-name-display');
            if (nameDisplay) nameDisplay.textContent = data.nombre || "Arquitecto";

            // 2. Restaurar Nivel Sidebar
            const currentLevel = data.nivelActual || 1;
            const badge = document.querySelector('.level-badge');
            if(badge) badge.textContent = `Nivel ${currentLevel}`;

            updateSidebarProgress(currentLevel);

            // IMPORTANTE: Devolvemos todos los datos para que auth.js decida qué hacer
            return data; 
        }
    } catch (error) {
        console.error("Error UI:", error);
    }
}

// --- PINTAR PROGRESO EN SIDEBAR ---
export function updateSidebarProgress(maxLevel) {
    for (let i = 1; i <= maxLevel; i++) {
        const moduleItem = document.querySelector(`.module-item[data-chapter="${i}"]`);
        if (moduleItem) {
            moduleItem.classList.remove('locked');
            const icon = moduleItem.querySelector('.lock-icon');
            if(icon) icon.textContent = ""; 
            
            if(!moduleItem.querySelector('.module-status')) {
                const line = document.createElement('div');
                line.className = 'module-status';
                moduleItem.appendChild(line);
            }
        }
    }
}