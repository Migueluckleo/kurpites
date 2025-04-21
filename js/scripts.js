/**
 * Carga un componente HTML externo de forma asíncrona
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
      console.error(`Error cargando componente ${path}:`, error);
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
  
      if (!menuToggle || !menuIcon || !menu) {
        throw new Error('Elementos de navbar no encontrados.');
      }
  
      menuToggle.addEventListener('click', () => {
        toggleMenu(menu, menuIcon);
      });
    } catch (error) {
      console.error('Error inicializando navbar:', error);
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
   * Cotizador IA – Llama a Tēchpa con los datos del formulario
   */
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
    salida.innerHTML = `<span class="animate-pulse text-brand-primary">🔍 Tēchpa está analizando tu proyecto...</span>`;
  
    // Validación mínima
    if (!tipo || !web || !objetivo) {
      salida.innerText = "⚠️ Por favor completa los campos obligatorios: tipo de negocio, sitio web y objetivo.";
      return;
    }
  
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
  
      const data = await respuesta.json();
      const mensaje = data.respuesta || "⚠️ Tēchpa no pudo generar una respuesta clara.";
  
      salida.innerText = mensaje;
  
      // Botón dinámico WhatsApp
      const whatsappBtn = document.createElement("a");
      whatsappBtn.href = `https://wa.me/523317188930?text=${encodeURIComponent("Hola, revisé mi cotización en Kurpites y me interesa:\n\n" + mensaje)}`;
      whatsappBtn.target = "_blank";
      whatsappBtn.rel = "noopener noreferrer";
      whatsappBtn.className = "block mt-6 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition w-full lg:w-auto";
      whatsappBtn.innerText = "📲 Enviar esta propuesta por WhatsApp";
  
      salida.appendChild(whatsappBtn);
  
    } catch (error) {
      salida.innerText = "❌ Hubo un problema al contactar con Tēchpa. Intenta de nuevo más tarde.";
      console.error("Error al llamar a la IA:", error);
    }
  }
  
  /**
   * Scroll suave para navegación por anclas
   */
  const enableSmoothScroll = () => {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };
  
  // Inicialización global al cargar la página
  (async () => {
    await loadComponent('./components/navbar.html', 'navbar');
    enableSmoothScroll();
  
    // Enlace moderno del botón
    const btn = document.getElementById("btnCotizar");
    if (btn) {
      btn.addEventListener("click", cotizarConIA);
    }
  })();
  