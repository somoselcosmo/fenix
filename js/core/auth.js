// js/core/auth.js
import { auth, db, googleProvider, resetPassword } from '../firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, getAdditionalUserInfo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { toggleLoader, loadUserProfile } from './ui.js';
import { showChapterView } from './router.js';
import { restoreLawsVisuals } from '../chapters/chapter2.js';

export function initAuth() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.getElementById('google-login-btn');
    const googleLoginBtn = document.getElementById('google-signin-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const forgotBtn = document.getElementById('forgot-btn');

    // 1. REGISTRO EMAIL
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('user-name').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const password = document.getElementById('user-password').value;
            const terms = document.getElementById('terms-check').checked;

            if (name.length < 2) return alert("Nombre inválido.");
            if (password.length < 6) return alert("Contraseña muy corta (min 6).");
            if (!terms) return alert("Acepta los términos.");

            toggleLoader(true);
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "usuarios", cred.user.uid), {
                    nombre: name,
                    email: email,
                    fechaRegistro: new Date(),
                    ...window.quizData // Datos del router
                });
                // El observador maneja la redirección
            } catch (error) {
                toggleLoader(false);
                alert("Error registro: " + error.message);
            }
        });
    }

    // 2. LOGIN EMAIL
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            toggleLoader(true);
            try {
                await signInWithEmailAndPassword(auth, 
                    document.getElementById('login-email').value,
                    document.getElementById('login-password').value
                );
            } catch (error) {
                toggleLoader(false);
                alert("Error login. Verifica tus datos.");
            }
        });
    }

    // 3. GOOGLE (Unificado)
    const handleGoogle = async () => {
        toggleLoader(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const details = getAdditionalUserInfo(result);
            
            if (details.isNewUser) {
                await setDoc(doc(db, "usuarios", result.user.uid), {
                    nombre: result.user.displayName,
                    email: result.user.email,
                    foto: result.user.photoURL,
                    fechaRegistro: new Date(),
                    metodo: "google",
                    ...window.quizData
                });
            }
        } catch (error) {
            toggleLoader(false);
            if (error.code !== 'auth/popup-closed-by-user') alert("Error Google.");
        }
    };

    if(googleBtn) googleBtn.addEventListener('click', handleGoogle);
    if(googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogle);

    // 4. LOGOUT
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut(auth);
            location.reload();
        });
    }

    // 5. RECUPERAR CLAVE
    if(forgotBtn) {
        forgotBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if(!email) return alert("Escribe tu correo arriba.");
            const res = await resetPassword(email);
            alert(res.success ? "Revisa tu correo." : res.message);
        });
    }

    // --- OBSERVADOR DE ESTADO (VIGILANTE) ---
    onAuthStateChanged(auth, async (user) => {
        const splitScreen = document.querySelector('.split-screen');
        const dashboard = document.getElementById('app-dashboard');
        const publicNavbar = document.querySelector('.navbar');

        if (user) {
            console.log("🟢 Sesión activa");
            if(splitScreen) splitScreen.classList.add('hidden');
            if(publicNavbar) publicNavbar.classList.add('hidden');
            if(dashboard) dashboard.classList.remove('hidden');

            // 1. Cargamos el perfil y OBTENEMOS los datos
            const userData = await loadUserProfile(user.uid);
            
            if(userData) {
                const level = userData.nivelActual || 1;

                // 2. Restaurar progreso específico del Capítulo 2
                if (userData.progresoCap2) {
                    restoreLawsVisuals(userData.progresoCap2);
                }

                // 3. Navegación al nivel actual
                document.querySelectorAll('.module-item').forEach(i => i.classList.remove('active'));
                const currentItem = document.querySelector(`.module-item[data-chapter="${level}"]`);
                if(currentItem) currentItem.classList.add('active');
                showChapterView(level);
            }

        } else {
            console.log("⚪ Invitado");
            if(splitScreen) splitScreen.classList.remove('hidden');
            if(publicNavbar) publicNavbar.classList.remove('hidden');
            if(dashboard) dashboard.classList.add('hidden');
        }
        
        // Retardo para suavidad
        setTimeout(() => toggleLoader(false), 500);
    });
}