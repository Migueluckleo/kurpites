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
      }
    } catch (error) {
      console.error(`❌ Error cargando componente ${path}:`, error);
    }
  };
  
  /**
   * Inicializa eventos del menú navbar
   */
  const initNavbarEvents = async () => {
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
   * Inicialización global
   */
  (async () => {
    await loadComponent('./components/navbar.html', 'navbar');
    enableSmoothScroll();
  
    const btn = document.getElementById("btnCotizar");
    if (btn) {
      btn.addEventListener("click", cotizarConIA);
    }
  })();
  