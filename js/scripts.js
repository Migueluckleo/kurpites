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
  
      // Verifica si el servidor respondió con JSON válido
      const contentType = respuesta.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
  
      const data = isJson ? await respuesta.json() : await respuesta.text();
  
      if (!respuesta.ok) {
        console.error("❌ Error del servidor:", data);
        salida.innerText = "❌ Tēchpa encontró un problema. Intenta más tarde.";
        return;
      }
  
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
      console.error("❌ Error de red o parseo:", error);
    }
  }
  