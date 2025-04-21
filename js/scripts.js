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
   * Cotizador IA – Llama a Tēchpa con los datos del formulario
   */
  export async function cotizarConIA() {
    const salida = document.getElementById("respuestaIA");
    salida.classList.remove("hidden");
    salida.innerHTML = `<span class="animate-pulse text-brand-primary">🔍 Tēchpa está analizando tu proyecto...</span>`;
  
    const campos = {
      nombreProyecto: document.getElementById("proyecto").value.trim(),
      tipo: document.getElementById("tipo").value,
      web: document.getElementById("web").value,
      campañas: document.getElementById("campañas").value,
      objetivo: document.getElementById("objetivo").value.trim(),
      tiempo: document.getElementById("tiempo").value,
      presupuesto: document.getElementById("presupuesto").value
    };
  
    if (!campos.tipo || !campos.web || !campos.objetivo) {
      salida.innerText = "⚠️ Por favor completa los campos obligatorios: tipo de negocio, sitio web y objetivo.";
      return;
    }
  
    const prompt = `
  Soy Tēchpa, asesor IA de Kurpites. Tengo un nuevo cliente potencial:
  
  📁 Proyecto: ${campos.nombreProyecto || "No especificado"}
  🏢 Tipo de negocio: ${campos.tipo}
  🖥️ Sitio web: ${campos.web}
  📣 Campañas Meta Ads: ${campos.campañas}
  🎯 Objetivo: ${campos.objetivo}
  ⏱️ Tiempo requerido: ${campos.tiempo}
  💵 Presupuesto: ${campos.presupuesto || "No definido"}
  
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
  
      const contentType = respuesta.headers.get("content-type") || "";
      const esJSON = contentType.includes("application/json");
      const data = esJSON ? await respuesta.json() : await respuesta.text();
  
      if (!respuesta.ok) {
        console.error("❌ Error del servidor:", data);
        salida.innerText = "❌ Tēchpa encontró un problema. Intenta más tarde.";
        return;
      }
  
      const mensaje = data.respuesta || "⚠️ Tēchpa no pudo generar una respuesta clara.";
      salida.innerText = mensaje;
  
      const whatsappBtn = document.createElement("a");
      whatsappBtn.href = `https://wa.me/523317188930?text=${encodeURIComponent("Hola, revisé mi cotización en Kurpites y me interesa:\n\n" + mensaje)}`;
      whatsappBtn.target = "_blank";
      whatsappBtn.rel = "noopener noreferrer";
      whatsappBtn.className = "block mt-6 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition w-full lg:w-auto";
      whatsappBtn.innerText = "📲 Enviar esta propuesta por WhatsApp";
      salida.appendChild(whatsappBtn);
  
    } catch (error) {
      salida.innerText = "❌ Hubo un problema al contactar con Tēchpa. Intenta de nuevo más tarde.";
      console.error("❌ Error de red o parseo:", error);
    }
  }
  
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
  