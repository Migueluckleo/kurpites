/**
 * Carga un componente HTML externo de forma asíncrona
 * @param {string} path - Ruta del archivo HTML
 * @param {string} targetId - ID del contenedor donde insertar
 */
const loadComponent = async (path, targetId) => {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const html = await response.text();
    document.getElementById(targetId).innerHTML = html;

    if (path.includes('navbar.html')) {
      await initNavbarEvents();
      initNavbarScroll();
      enableSmoothScroll();
    }
  } catch (error) {
    console.error(`❌ Error cargando componente ${path}:`, error);
  }
};

/**
 * Inicializa eventos del menú navbar
 */
const initNavbarEvents = () => {
  try {
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    if (!menuToggle || !menuIcon || !menu) throw new Error('Elementos de navbar no encontrados.');

    menuToggle.addEventListener('click', () => toggleMenu(menu, menuIcon));
  } catch (error) {
    console.error('❌ Error inicializando navbar:', error);
  }
};

/**
 * Alterna visibilidad del menú móvil
 */
const toggleMenu = (menu, menuIcon) => {
  menu.classList.toggle('hidden');
  menuIcon.classList.toggle('ri-menu-line');
  menuIcon.classList.toggle('ri-close-line');
};

/**
 * Oculta o muestra la navbar al hacer scroll
 */
const initNavbarScroll = () => {
  const navbar = document.querySelector('nav');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      navbar.classList.add('-translate-y-full');
    } else {
      navbar.classList.remove('-translate-y-full');
    }
    lastScrollTop = Math.max(0, scrollTop);
  });
};

/**
 * Scroll suave para navegación por anclas
 */
const enableSmoothScroll = () => {
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

/**
 * Espera de forma asincrónica los milisegundos indicados.
 * @param {number} ms - Tiempo a esperar
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Efecto de tipeo animado cíclico
 * @param {string[]} frases - Arreglo de frases a mostrar
 * @param {string} targetId - ID del elemento donde escribir
 */
const initTypingEffect = async (frases, targetId = "typingText") => {
  const textoElemento = document.getElementById(targetId);
  if (!textoElemento) {
    console.warn(`⚠️ Elemento con id '${targetId}' no encontrado para el efecto typing.`);
    return;
  }

  let fraseIndex = 0;

  while (true) {
    const fraseActual = frases[fraseIndex];

    // Escribir
    for (let i = 0; i <= fraseActual.length; i++) {
      textoElemento.textContent = fraseActual.slice(0, i);
      await delay(60);
    }

    await delay(2000); // Espera visible

    // Borrar
    for (let i = fraseActual.length; i >= 0; i--) {
      textoElemento.textContent = fraseActual.slice(0, i);
      await delay(40);
    }

    // Siguiente
    fraseIndex = (fraseIndex + 1) % frases.length;
  }
};

/**
 * Inicialización global al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('/components/navbar.html', 'navbar');

  // Iniciar efecto de tipeo
  const frasesTyping = [
    "8 de cada 10 decisiones de compra inician en digital.",
    "75% de las personas juzgan la credibilidad de una marca basándose solo en el diseño de su sitio web.",
    "Las empresas que tienen presencia online profesional generan en promedio 2.6 veces más ingresos que las que no."
  ];

  await initTypingEffect(frasesTyping, "typingText");
});
