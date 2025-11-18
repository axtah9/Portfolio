document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    startApp();
});

function startApp() {
    // Cargar header y footer primero
    loadFragment("header", "includes/header.html").then(() => {
        // Ahora que el header está en el DOM, podemos asignar el listener

        try {
            LoadLanguageAndListeners();
            ProjectsNavListeners();
        } catch (error) {
            console.error("Error al asignar listeners o cargar idioma:", error);   
        }
    });
    

    loadFragment("footer", "includes/footer.html");
}


async function loadFragment(id, file) {
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;
}

async function loadTranslations(lang) {
    const response = await fetch("JSON/translations.json");
    const data = await response.json();

    for (const key in data[lang]) {
        const element = document.getElementById(key);

        if (element) {
            element.textContent = data[lang][key];
        }
    }
}


function LoadLanguageAndListeners() {
    const engButton = document.getElementById("eng-button");
    const espButton = document.getElementById("esp-button");
    
    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en'); // Inglés por defecto
    }
    else {
        loadTranslations(localStorage.getItem('language')); // Cargar por defecto

        if (localStorage.getItem('language') === 'en') {
            engButton.classList.add("active");
        }
        else {
            espButton.classList.add("active");
        }    
    }
    
    if (engButton && espButton) {
        engButton.addEventListener("click", function () {
            loadTranslations("en");
            engButton.classList.add("active");
            espButton.classList.remove("active");
            
            localStorage.setItem('language', 'en');
        });
        
        espButton.addEventListener("click", function () {
            loadTranslations("es");
            espButton.classList.add("active");
            engButton.classList.remove("active");
            
            localStorage.setItem('language', 'es');
        });
    }
}


// RETOCAR ESTO PARA QUE SEA MÁS DINÁMICO
function ProjectsNavListeners() {
    const gamedevNav = document.getElementById("gamedev-nav");
    const webdevNav = document.getElementById("webdev-nav");
    const appdevNav = document.getElementById("appdev-nav");
    const aidevNav = document.getElementById("aidev-nav");

    console.log("Buscando navegación de proyectos");

    if (gamedevNav && webdevNav && appdevNav && aidevNav) {
        console.log("Asignando listeners a navegación de proyectos");
        
        gamedevNav.addEventListener("click", function () {
            toggleProjectsPanel('gamedev');
            gamedevNav.classList.add("active");
            webdevNav.classList.remove("active");
            appdevNav.classList.remove("active");
            aidevNav.classList.remove("active");
        });

        webdevNav.addEventListener("click", function () {
            toggleProjectsPanel('webdev');
            webdevNav.classList.add("active");
            gamedevNav.classList.remove("active");
            appdevNav.classList.remove("active");
            aidevNav.classList.remove("active");
        });

        appdevNav.addEventListener("click", function () {
            toggleProjectsPanel('appdev');
            appdevNav.classList.add("active");
            gamedevNav.classList.remove("active");
            webdevNav.classList.remove("active");
            aidevNav.classList.remove("active");
        });

        aidevNav.addEventListener("click", function () {
            toggleProjectsPanel('aidev');
            aidevNav.classList.add("active");
            gamedevNav.classList.remove("active");
            webdevNav.classList.remove("active");
            appdevNav.classList.remove("active");
        });
    }
}

// RETOCAR ESTO PARA QUE SEA MÁS DINÁMICO
function toggleProjectsPanel(section) {
    const gamedevSection = document.querySelector('.gamedev-section');
    const webdevSection = document.querySelector('.webdev-section');
    const appdevSection = document.querySelector('.appdev-section');
    const aidevSection = document.querySelector('.aidev-section');

    if (section === 'gamedev') {
        gamedevSection.classList.add('active');
        gamedevSection.classList.remove('hidden');

        webdevSection.classList.add('hidden');
        appdevSection.classList.add('hidden');
        aidevSection.classList.add('hidden');
    }
    else if (section === 'webdev') {
        webdevSection.classList.add('active');
        webdevSection.classList.remove('hidden');

        gamedevSection.classList.add('hidden');
        appdevSection.classList.add('hidden');
        aidevSection.classList.add('hidden');
    }
    else if (section === 'appdev') {
        appdevSection.classList.add('active');
        appdevSection.classList.remove('hidden');

        gamedevSection.classList.add('hidden');
        webdevSection.classList.add('hidden');
        appdevSection.classList.remove('hidden');
        aidevSection.classList.add('hidden');
    }
    else if (section === 'aidev') {
        aidevSection.classList.add('active');
        aidevSection.classList.remove('hidden');

        gamedevSection.classList.add('hidden');
        webdevSection.classList.add('hidden');
        appdevSection.classList.add('hidden');
    }
}


function showBlogOverlay(htmlFile) {
    const overlay = document.getElementById("blog-overlay");

    // Cargar el fragmento
    fetch(htmlFile)
        .then(res => res.text())
        .then(fragment => {
        // Inyectar el contenido dentro del overlay, manteniendo el contenedor
        overlay.innerHTML = fragment;

        // Mostrar el overlay (no toques style.display, usa la clase)
        overlay.classList.add("show");

        // Forzar reflow y reiniciar la animación del contenido para que siempre se reproduzca
        const content = overlay.querySelector(".overlay-content");
        if (content) {
            content.style.animation = "none";
            // Forzar reflow
            // eslint-disable-next-line no-unused-expressions
            content.offsetHeight;
            content.style.animation = "fadeInUp 0.5s ease forwards";
        }

        // Delegación del cierre: evita depender de inline onclick
        const closeBtn = overlay.querySelector(".close-button");
        if (closeBtn) {
            closeBtn.addEventListener("click", hideBlogOverlay);
        }

        // Cerrar al click fuera del panel
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) hideBlogOverlay();
        }, { once: true });
    });

    // Guardar la posición actual del scroll
    localStorage.setItem('lastScrollPosition', window.scrollY);

    // Scrollea al top
    window.scrollTo({
        top: 0,
        behavior: "smooth" // animado
    });
}

function hideBlogOverlay() {
    const overlay = document.getElementById("blog-overlay");
    const content = overlay.querySelector(".overlay-content");

    if (content) {
        content.style.animation = "fadeOutDown 0.5s ease forwards";
    }

    // Esperar fin de animación
    setTimeout(() => {
        overlay.classList.remove("show");
        // Limpia el contenido inyectado para que la próxima vez sea fresco
        overlay.innerHTML = "";
    }, 500);

    // Scrollea de vuelta a la posición guardada
    window.scrollTo({
        top: localStorage.getItem('lastScrollPosition') || 0,
        behavior: "smooth" // animado
    });
}
