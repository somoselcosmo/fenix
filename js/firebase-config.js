// js/firebase-config.js

// 1. Imports Oficiales (Versión estable)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Tu Configuración (¡Pega aquí TUS datos de la consola!)
const firebaseConfig = {
  apiKey: "AIzaSyAmpwIwGXxX5uXIDTSZcIP5oGoGtsqENlw",
  authDomain: "fenix-digital-76776.firebaseapp.com",
  projectId: "fenix-digital-76776",
  storageBucket: "fenix-digital-76776.firebasestorage.app",
  messagingSenderId: "993925809420",
  appId: "1:993925809420:web:863a059810ddd2728d7529"
};

// 3. Inicializar Firebase (Solo se hace UNA vez)
const app = initializeApp(firebaseConfig);

// 4. Exportar las herramientas para usarlas en otros archivos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Función de utilidad para recuperar contraseña
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Correo enviado." };
    } catch (error) {
        return { success: false, message: error.message };
    }
};