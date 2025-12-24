// js/core/router.js

// --- NAVEGACIÓN INICIAL (Quiz vs Login) ---
export function initAuthNavigation() {
    const btnLoginHeader = document.getElementById('btn-login');
    const backToQuizBtn = document.getElementById('back-to-quiz-btn');
    
    if (btnLoginHeader) {
        btnLoginHeader.addEventListener('click', () => toggleView('forward'));
    }
    if (backToQuizBtn) {
        backToQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleView('backward');
        });
    }
}

function toggleView(direction) {
    const quizContainer = document.getElementById('quiz-container');
    const loginContainer = document.getElementById('login-container');
    if (!quizContainer || !loginContainer) return;

    if (direction === 'forward') {
        quizContainer.classList.add('slide-out-left');
        setTimeout(() => {
            quizContainer.classList.add('hidden');
            quizContainer.classList.remove('slide-out-left');
            loginContainer.classList.remove('hidden');
            loginContainer.classList.add('slide-in-right-start');
            void loginContainer.offsetWidth; 
            loginContainer.classList.remove('slide-in-right-start');
        }, 400);
    } else if (direction === 'backward') {
        loginContainer.classList.add('slide-out-right');
        setTimeout(() => {
            loginContainer.classList.add('hidden');
            loginContainer.classList.remove('slide-out-right');
            quizContainer.classList.remove('hidden');
            quizContainer.classList.add('slide-in-left-start');
            void quizContainer.offsetWidth; 
            quizContainer.classList.remove('slide-in-left-start');
        }, 400);
    }
}

// --- NAVEGACIÓN DEL QUIZ (Pasos) ---
export function initQuizNavigation() {
    const startBtn = document.getElementById('start-quiz-btn');
    const finishQuizBtn = document.getElementById('finish-quiz');
    
    // Almacén temporal de datos del quiz
    window.quizData = {}; 

    if(startBtn) startBtn.addEventListener('click', () => showStep(0, 1));
    if(finishQuizBtn) finishQuizBtn.addEventListener('click', () => showStep(5, 6));

    document.querySelectorAll('.option-btn, .btn-subtle').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = btn.dataset.next;
            const key = btn.dataset.key;
            const value = btn.dataset.value;
            
            // Guardamos en variable global temporal
            if(key) window.quizData[key] = value;
            
            const currentStepNum = parseInt(nextStep) - 1;
            showStep(currentStepNum, nextStep);
        });
    });
}

function showStep(current, next) {
    const currentEl = document.getElementById(`step-${current}`);
    const nextEl = document.getElementById(`step-${next}`);
    if (currentEl && nextEl) {
        currentEl.classList.add('slide-out-left');
        setTimeout(() => {
            currentEl.classList.add('hidden');
            currentEl.classList.remove('slide-out-left');
            nextEl.classList.remove('hidden');
            nextEl.classList.add('slide-in-right-start'); 
            void nextEl.offsetWidth; 
            nextEl.classList.remove('slide-in-right-start');
        }, 450);
    }
}

// --- NAVEGACIÓN DASHBOARD (Capítulos) ---
export function initDashboardNavigation() {
    const moduleItems = document.querySelectorAll('.module-item');
    moduleItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('locked')) return;
            
            moduleItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetChapter = item.dataset.chapter;
            showChapterView(targetChapter);
        });
    });
}

export function showChapterView(chapterNum) {
    document.querySelectorAll('.chapter-view').forEach(view => {
        view.classList.add('hidden');
    });
    const targetView = document.getElementById(`chapter-${chapterNum}-view`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('fade-in');
    }
}