// js/main.js
import { initAuth } from './core/auth.js';
import { initAuthNavigation, initQuizNavigation, initDashboardNavigation } from './core/router.js';
import { initChapter1 } from './chapters/chapter1.js';
import { initChapter2 } from './chapters/chapter2.js';
import { initChapter3 } from './chapters/chapter3.js';
import { initChapter4 } from './chapters/chapter4.js';
import { initChapter5 } from './chapters/chapter5.js';
import { initChapter6 } from './chapters/chapter6.js';
import { initChapter7 } from './chapters/chapter7.js';
import { initChapter8 } from './chapters/chapter8.js';
import { initChapter9 } from './chapters/chapter9.js';
import { initChapter10 } from './chapters/chapter10.js';
import { initChapter11 } from './chapters/chapter11.js';
import { initChapter12 } from './chapters/chapter12.js';
import { initChapter13 } from './chapters/chapter13.js';
import { initChapter14 } from './chapters/chapter14.js';
import { initChapter15 } from './chapters/chapter15.js';
import { initChapter16 } from './chapters/chapter16.js';
import { initChapter17 } from './chapters/chapter17.js';
import { initChapter18 } from './chapters/chapter18.js';
import { initChapter19 } from './chapters/chapter19.js';
import { initChapter20 } from './chapters/chapter20.js';
import { initChapter21 } from './chapters/chapter21.js';
import { initChapter22 } from './chapters/chapter22.js';
import { initChapter23 } from './chapters/chapter23.js';
import { initChapter24 } from './chapters/chapter24.js';
import { initChapter25 } from './chapters/chapter25.js';
import { initChapter26 } from './chapters/chapter26.js';





document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Fénix OS Iniciando...");

    // 1. Inicializar Navegación Base
    initAuthNavigation();
    initQuizNavigation();
    initDashboardNavigation();

    // 2. Inicializar Lógica de Capítulos
    initChapter1();
    initChapter2();
    initChapter3();
    initChapter4();
    initChapter5();
    initChapter6();
    initChapter7();
    initChapter8();
    initChapter9();
    initChapter10();
    initChapter11();
    initChapter12();
    initChapter13();
    initChapter14();
    initChapter15();
    initChapter16();
    initChapter17();
    initChapter18();
    initChapter19();
    initChapter20();
    initChapter21();
    initChapter22();
    initChapter23();
    initChapter24();
    initChapter25();
    initChapter26();
  
    // 3. Arrancar Sistema de Autenticación (Esto dispara el observador)
    initAuth();
});