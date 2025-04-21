/**
 * Función para cargar un componente HTML externo de forma asíncrona
 * @param {string} path - Ruta del archivo HTML a cargar
 * @param {string} targetId - ID del contenedor donde se insertará el componente
 */
const loadComponent = async (path, targetId) => {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;

        // Ejecutar lógica específica si es el navbar
        if (path.includes('navbar.html')) {
            await initNavbarEvents();
            initNavbarScroll();
        }
    } catch (error) {
        console.error(`Error cargando componente ${path}:`, error);
    }
};

/**
 * Inicializa los eventos de la Navbar una vez cargado el HTML
 */
const initNavbarEvents = async () => {
    try {
        const menuToggle = document.getElementById('menu-toggle');
        const menuIcon = document.getElementById('menu-icon');
        const menu = document.getElementById('menu');

        if (!menuToggle || !menuIcon || !menu) {
            throw new Error('No se encontraron los elementos de la navbar.');
        }

        menuToggle.addEventListener('click', async () => {
            await toggleMenu(menu, menuIcon);
        });

    } catch (error) {
        console.error('Error inicializando eventos de la navbar:', error);
    }
};

/**
 * Alterna la visibilidad del menú y el ícono hamburguesa/cerrar
 * @param {HTMLElement} menu 
 * @param {HTMLElement} menuIcon 
 */
const toggleMenu = async (menu, menuIcon) => {
    menu.classList.toggle('hidden');

    if (menu.classList.contains('hidden')) {
        menuIcon.classList.remove('ri-close-line');
        menuIcon.classList.add('ri-menu-line');
    } else {
        menuIcon.classList.remove('ri-menu-line');
        menuIcon.classList.add('ri-close-line');
    }
};

/**
 * Lógica para mostrar/ocultar la navbar al hacer scroll
 */
const initNavbarScroll = () => {
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo - Oculta Navbar
            navbar.classList.add('-translate-y-full');
        } else {
            // Scroll hacia arriba - Muestra Navbar
            navbar.classList.remove('-translate-y-full');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
};

// Ejecutar carga del navbar al iniciar
await loadComponent('./components/navbar.html', 'navbar');

// JS opcional si quieres hacer tracking o efectos extra
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  export async function cotizarConIA() {
    const nombreProyecto = document.getElementById("proyecto").value.trim();
    const tipo = document.getElementById("tipo").value;
    const web = document.getElementById("web").value;
    const campañas = document.getElementById("campañas").value;
    const objetivo = document.getElementById("objetivo").value.trim();
    const tiempo = document.getElementById("tiempo").value;
    const presupuesto = document.getElementById("presupuesto").value;
  
    const salida = document.getElementById("respuestaIA");
    salida.classList.remove("hidden");
    salida.innerText = "🔍 Tēchpa está analizando tu proyecto...";
  
    // Construir prompt personalizado
    const prompt = `
  Soy Tēchpa, asesor IA de Kurpites. Tengo un nuevo cliente potencial.
  
  📁 Proyecto: ${nombreProyecto || "No especificado"}
  🏢 Tipo de negocio: ${tipo}
  🖥️ Sitio web: ${web}
  📣 Campañas Meta Ads: ${campañas}
  🎯 Objetivo: ${objetivo}
  ⏱️ Tiempo requerido: ${tiempo}
  💵 Presupuesto: ${presupuesto || "No definido"}
  
  Con base en esta información, recomiéndale:
  - El paquete Kurpites más adecuado (Class B, A o S)
  - El tiempo estimado de entrega
  - El rango de precio sugerido
  - Un mensaje claro, directo y empático
  `;
  
    try {
      const respuesta = await fetch("/api/cotizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
  
      const data = await respuesta.json();
      salida.innerText = data.respuesta || "⚠️ Tēchpa no pudo generar una respuesta clara.";
    } catch (error) {
      salida.innerText = "❌ Hubo un problema al conectarse con Tēchpa. Intenta más tarde.";
      console.error("Error al llamar a la IA:", error);
    }
  }