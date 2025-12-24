// js/chapters/chapter2.js
import { auth, db } from '../firebase-config.js';
import { doc, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateSidebarProgress } from '../core/ui.js';

// --- BASE DE DATOS DE CONTENIDO (TUS NOTAS FORMATEADAS) ---
const LAWS_CONTENT = [
    {
        id: 1,
        title: "Ley del Control",
        icon: "🎮",
        summary: "Te sientes bien contigo mismo hasta el grado en que sientes el control.",
        content: `
            <p class="law-definition">Uno se siente bien consigo mismo, positivo de sí mismo, hasta el grado en que se siente que está en <strong>control</strong> de su propia vida.</p>
            <h3>El Arquitecto del Destino</h3>
            <p>El control empieza en los pensamientos, estos determinan los sentimientos y sus sentimientos determinan sus acciones.</p>
            <p>La clave del éxito es sentir que <strong>usted es el arquitecto de su destino</strong>. Cuando sus pensamientos son controlados, los sentimientos se regulan y las acciones determinan su éxito.</p>
            <div class="highlight-box">
                <strong>Pregunta clave:</strong> ¿En qué áreas de tu vida sientes que tienes el control total ahora mismo?
            </div>
        `,
        interaction: "button",
        btnText: "Tomar el Control Total"
    },
    {
        id: 2,
        title: "Ley del Accidente",
        icon: "🎲",
        summary: "Fallar en planear es planear fallar.",
        content: `
            <p class="law-definition">Al fallar en planear, está planeando fallar.</p>
            <h3>¿Vives por diseño o por defecto?</h3>
            <p>El 80% de las personas vive según esta ley, creyendo en la "suerte" o en estar en el "lugar indicado". Esto causa tremenda infelicidad.</p>
            <ul class="law-list">
                <li><strong>Sin plan, hay confusión:</strong> Como armar un avión sin instrucciones.</li>
                <li><strong>Planificar es Control:</strong> Un mapa te evita perderte en la vida.</li>
            </ul>
            <p>Para librarte de esta ley, necesitas objetivos claros y un plan de acción.</p>
        `,
        interaction: "input",
        placeholder: "Escribe una meta específica para mañana...",
        btnText: "Romper el Accidente"
    },
    {
        id: 3,
        title: "Causa y Efecto",
        icon: "🌱",
        summary: "Para cada efecto en la vida hay una causa específica.",
        content: `
            <p class="law-definition">Nada pasa por accidente. Todo lo que eres o serás es resultado de una causa.</p>
            <h3>La Ley de Acero del Universo</h3>
            <p>Si quieres cambiar el efecto (tus resultados), debes cambiar la causa. La aplicación más importante es: <strong>Los pensamientos son causas y las condiciones son efectos.</strong></p>
            <p>Afortunadamente, hay una sola cosa en el universo sobre la que tienes control absoluto: <strong>Tus Pensamientos.</strong></p>
            <div class="highlight-box">
                Si siembras pensamientos de éxito, cosecharás éxito.
            </div>
        `,
        interaction: "switch", // Lógica especial
        btnText: "Cambiar la Causa"
    },
    {
        id: 4,
        title: "Ley de la Creencia",
        icon: "🙏",
        summary: "Crea en lo que crea con fuerza, se volverá realidad.",
        content: `
            <p class="law-definition">Usted siempre actuará en un modo consistente con sus creencias.</p>
            <h3>El efecto Henry Ford</h3>
            <p><em>"Si crees que puedes hacer algo o si crees que no puedes hacerlo, tienes razón."</em></p>
            <p>Tu cerebro tiene un deseo profundo de permanecer consistente con lo que crees. Si crees fervientemente que puedes llegar al éxito, verás oportunidades donde otros ven obstáculos.</p>
            <p>Debes desafiar tus creencias autolimitantes.</p>
        `,
        interaction: "button",
        btnText: "¡Creo que PUEDO!"
    },
    {
        id: 5,
        title: "Ley de la Expectativa",
        icon: "🔮",
        summary: "Lo que se espera se consigue.",
        content: `
            <p class="law-definition">No se consigue lo que se quiere, sino lo que se espera.</p>
            <h3>La Profecía Autocumplida</h3>
            <p>Tus expectativas se convierten en tu propia profecía de logros. Si esperas que pase algo bueno con confianza, pasará.</p>
            <p>Las personas exitosas tienen una actitud de <strong>expectativa positiva</strong> realista. Esperan tener éxito, esperan caer bien, esperan ser felices.</p>
            <div class="highlight-box">
                "Hoy algo maravilloso me va a ocurrir."
            </div>
        `,
        interaction: "button",
        btnText: "Confirmar Profecía"
    },
    {
        id: 6,
        title: "Ley de la Atracción",
        icon: "🧲",
        summary: "Eres un imán viviente.",
        content: `
            <p class="law-definition">Atraes a personas y situaciones que están en armonía con tus pensamientos dominantes.</p>
            <h3>Vibración Mental</h3>
            <p>Tus pensamientos son una forma de energía que vibra y sale hacia el exterior. Inevitablemente atraes lo que temes o lo que amas.</p>
            <p>Por eso es vital mantener tus pensamientos en <strong>lo que deseas</strong> y mantenerlos fuera de lo que NO deseas.</p>
        `,
        interaction: "magnet", // Lógica especial
        btnText: "A T R A E R"
    },
    {
        id: 7,
        title: "Ley de Correspondencia",
        icon: "🪞",
        summary: "Como es adentro, es afuera.",
        content: `
            <p class="law-definition">Tu mundo exterior es un espejo que refleja tu mundo interior.</p>
            <h3>El Espejo de la Vida</h3>
            <p>Si quieres cambiar tu exterior (relaciones, dinero, salud), debes trabajar en tu interior. No puedes cambiar el reflejo en el espejo sin cambiar la cara que se refleja.</p>
            <p>Esta ley explica todas las demás. Todas las causas son mentales.</p>
            <div class="highlight-box">
                Nos convertimos en lo que pensamos la mayor parte del tiempo.
            </div>
        `,
        interaction: "button",
        btnText: "He mirado en el espejo"
    }
];

// --- INICIALIZACIÓN ---
export function initChapter2() {
    renderGrid();
    setupModalLogic();
}

// 1. RENDERIZAR EL GRID (Las tarjetas en el HTML)
function renderGrid() {
    const container = document.querySelector('.laws-grid');
    if (!container) return;

    container.innerHTML = LAWS_CONTENT.map((law, index) => `
        <div class="law-card locked" id="law-${law.id}" onclick="openLawModal(${law.id})">
            <div class="lock-overlay"><span class="lock-icon">🔒</span></div>
            <div class="law-header">
                <span class="law-icon">${law.icon}</span>
                <h3>${law.title}</h3>
            </div>
            <div class="law-body">
                <p>${law.summary}</p>
            </div>
            <div class="status-indicator"></div>
        </div>
    `).join('');
}

// 2. LÓGICA DEL MODAL
function setupModalLogic() {
    // Exponemos la función al HTML global para que el onclick funcione
    window.openLawModal = (id) => {
        const card = document.getElementById(`law-${id}`);
        // Solo abrir si no está bloqueada (o si es la 1, que siempre empieza abierta)
        if (card.classList.contains('locked') && id !== 1) return;

        const law = LAWS_CONTENT.find(l => l.id === id);
        renderModalContent(law);
        
        document.getElementById('law-modal').classList.remove('hidden');
    };

    // Cerrar Modal
    document.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.getElementById('law-modal').classList.add('hidden');
    });
}

// 3. RELLENAR EL MODAL CON DATOS
function renderModalContent(law) {
    document.getElementById('modal-icon').textContent = law.icon;
    document.getElementById('modal-title').textContent = law.title;
    document.getElementById('modal-body').innerHTML = law.content;

    const footer = document.getElementById('modal-interaction');
    footer.innerHTML = ''; // Limpiar anterior

    // Renderizar la interacción correcta según el tipo
    if (law.interaction === 'input') {
        footer.innerHTML = `
            <input type="text" id="modal-input" placeholder="${law.placeholder}" class="modal-input">
            <button class="btn-primary full-width" onclick="completeLaw(${law.id})">${law.btnText}</button>
        `;
    } else if (law.interaction === 'switch') {
        footer.innerHTML = `
            <div class="cause-effect-toggle">
                <span>Negativo</span>
                <label class="switch">
                    <input type="checkbox" id="modal-switch">
                    <span class="slider round"></span>
                </label>
                <span>Positivo</span>
            </div>
            <button class="btn-primary full-width" id="modal-btn" disabled onclick="completeLaw(${law.id})">${law.btnText}</button>
        `;
        // Lógica del switch
        setTimeout(() => {
            document.getElementById('modal-switch').addEventListener('change', (e) => {
                const btn = document.getElementById('modal-btn');
                btn.disabled = !e.target.checked;
            });
        }, 100);
    } else if (law.interaction === 'magnet') {
        footer.innerHTML = `
            <button class="btn-magnet full-width" id="modal-magnet">${law.btnText}</button>
        `;
        // Lógica Imán
        setTimeout(() => {
            const btn = document.getElementById('modal-magnet');
            let timer;
            btn.addEventListener('mousedown', () => {
                btn.textContent = "A T R A Y E N D O . . .";
                btn.classList.add('pulsing');
                timer = setTimeout(() => window.completeLaw(law.id), 2000);
            });
            btn.addEventListener('mouseup', () => {
                clearTimeout(timer);
                btn.textContent = law.btnText;
                btn.classList.remove('pulsing');
            });
        }, 100);
    } else {
        // Botón normal
        footer.innerHTML = `
            <button class="btn-primary full-width" onclick="completeLaw(${law.id})">${law.btnText}</button>
        `;
    }
}

// 4. COMPLETAR LEY (GUARDAR EN FIREBASE)
window.completeLaw = async function(id) {
    const btn = document.querySelector('#modal-interaction button');
    if(btn) btn.textContent = "Guardando...";

    // Validación input
    if (id === 2) {
        const val = document.getElementById('modal-input').value;
        if (val.length < 5) return alert("Escribe un plan real.");
    }

    try {
        // Guardar progreso
        await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
            progresoCap2: id
        }, { merge: true });

        // Cerrar modal
        document.getElementById('law-modal').classList.add('hidden');
        
        // Actualizar UI visualmente
        restoreLawsVisuals(id);

        // Si es la última, finalizar capítulo
        if (id === 7) {
            finishChapter2();
        }

    } catch (error) {
        console.error(error);
        alert("Error al guardar.");
    }
};

// 5. RESTAURAR VISUALES (PINTAR VERDE)
export function restoreLawsVisuals(lastId) {
    for (let i = 1; i <= lastId; i++) {
        const card = document.getElementById(`law-${i}`);
        if(card) {
            card.classList.remove('locked');
            card.classList.add('completed');
            const lock = card.querySelector('.lock-overlay');
            if(lock) lock.style.display = 'none';
        }
        
        // Desbloquear el siguiente (i+1) para que se pueda abrir
        const next = document.getElementById(`law-${i+1}`);
        if(next) {
            next.classList.remove('locked');
            const lock = next.querySelector('.lock-overlay');
            if(lock) lock.style.display = 'none';
        }
    }
    
    // Caso especial: La 1 siempre debe estar desbloqueada visualmente si no hay progreso
    if (!lastId) {
        const card1 = document.getElementById('law-1');
        if(card1) {
            card1.classList.remove('locked');
            card1.querySelector('.lock-overlay').style.display = 'none';
        }
    }
}

async function finishChapter2() {
    await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
        nivelActual: 3,
        cap2Completed: new Date()
    });
    alert("¡Felicidades! Módulo 2 Completado.");
    updateSidebarProgress(3);
}