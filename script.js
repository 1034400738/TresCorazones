/* =========================================================
   TRES CORAZONES by Briana Suárez - Funcionalidad
   ========================================================= */

// ================= CONFIGURACIÓN =================
const CONFIG = {
  whatsapp: "573126084645",   // 57 (Colombia) + número
  horaApertura: 9,            // 9:00 a.m.
  horaCierre: 20,             // 8:00 p.m.
  intervaloMinutos: 30,       // cada cuánto se ofrecen horas en el formulario
  zonaHoraria: "America/Bogota"
};

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarHeaderScroll();
  iniciarAnimaciones();
  iniciarDestellos();
  iniciarWhatsApp();
  iniciarFormulario();
  mostrarEstadoHorario();
  document.getElementById("year").textContent = new Date().getFullYear();
});

// ================= MENÚ CELULAR =================
function iniciarMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  const cerrarMenu = () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    toggle.classList.toggle("open", abierto);
    toggle.setAttribute("aria-expanded", String(abierto));
    document.body.classList.toggle("menu-open", abierto);
  });

  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", cerrarMenu));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) cerrarMenu();
  });
}

// ================= ENCABEZADO Y ENLACE ACTIVO =================
function iniciarHeaderScroll() {
  const header = document.getElementById("header");
  const secciones = document.querySelectorAll("section[id]");
  const enlaces = document.querySelectorAll(".nav__link");

  const actualizar = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);

    let actual = "inicio";
    secciones.forEach(seccion => {
      if (window.scrollY >= seccion.offsetTop - 150) actual = seccion.id;
    });

    enlaces.forEach(enlace => {
      enlace.classList.toggle("active", enlace.getAttribute("href") === "#" + actual);
    });
  };

  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}

// ================= ANIMACIÓN AL APARECER =================
function iniciarAnimaciones() {
  const elementos = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    observer.observe(el);
  });
}

// ================= DESTELLOS DORADOS EN EL INICIO =================
function iniciarDestellos() {
  const contenedor = document.getElementById("sparkles");
  if (!contenedor) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cantidad = window.innerWidth < 600 ? 18 : 35;

  for (let i = 0; i < cantidad; i++) {
    const destello = document.createElement("span");
    destello.className = "sparkle";
    destello.style.left = `${Math.random() * 100}%`;
    destello.style.top = `${30 + Math.random() * 70}%`;
    destello.style.animationDuration = `${4 + Math.random() * 6}s`;
    destello.style.animationDelay = `${Math.random() * 6}s`;
    const tamano = 2 + Math.random() * 3;
    destello.style.width = `${tamano}px`;
    destello.style.height = `${tamano}px`;
    contenedor.appendChild(destello);
  }
}

// ================= ENLACES DE WHATSAPP =================
function crearEnlaceWhatsApp(texto) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

function iniciarWhatsApp() {
  const saludo = "¡Hola Tres Corazones! 💖 Quiero información sobre sus servicios.";

  document.querySelectorAll(".js-whatsapp").forEach(enlace => {
    enlace.href = crearEnlaceWhatsApp(saludo);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
  });
}

// ================= HORA ACTUAL EN BOGOTÁ =================
function ahoraEnBogota() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.zonaHoraria,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const valor = tipo => partes.find(p => p.type === tipo).value;

  return {
    fecha: `${valor("year")}-${valor("month")}-${valor("day")}`,
    minutos: (parseInt(valor("hour"), 10) % 24) * 60 + parseInt(valor("minute"), 10)
  };
}

function formatoHora(minutosTotales) {
  const h = Math.floor(minutosTotales / 60);
  const m = minutosTotales % 60;
  const sufijo = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

// ================= ESTADO ABIERTO / CERRADO =================
function mostrarEstadoHorario() {
  const estado = document.getElementById("openStatus");
  if (!estado) return;

  const actualizar = () => {
    const { minutos } = ahoraEnBogota();
    const abierto = minutos >= CONFIG.horaApertura * 60 && minutos < CONFIG.horaCierre * 60;

    estado.textContent = abierto ? "● Abierto ahora" : "● Cerrado en este momento";
    estado.classList.toggle("is-open", abierto);
    estado.classList.toggle("is-closed", !abierto);
  };

  actualizar();
  setInterval(actualizar, 60000);
}

// ================= FORMULARIO DE RESERVA =================
function iniciarFormulario() {
  const form = document.getElementById("bookingForm");
  const nombre = document.getElementById("nombre");
  const telefono = document.getElementById("telefono");
  const servicio = document.getElementById("servicio");
  const fecha = document.getElementById("fecha");
  const hora = document.getElementById("hora");
  const mensaje = document.getElementById("mensaje");
  const error = document.getElementById("formError");

  // No permitir fechas pasadas
  fecha.min = ahoraEnBogota().fecha;

  // Llenar las horas disponibles según la fecha elegida
  const cargarHoras = () => {
    const seleccionAnterior = hora.value;
    hora.innerHTML = '<option value="">Selecciona una hora</option>';

    const hoy = ahoraEnBogota();
    const esHoy = fecha.value === hoy.fecha;
    const ultimaCita = CONFIG.horaCierre * 60 - 60; // última cita una hora antes del cierre

    for (let m = CONFIG.horaApertura * 60; m <= ultimaCita; m += CONFIG.intervaloMinutos) {
      if (esHoy && m <= hoy.minutos + 30) continue;
      const opcion = document.createElement("option");
      opcion.value = formatoHora(m);
      opcion.textContent = formatoHora(m);
      hora.appendChild(opcion);
    }

    if (hora.options.length === 1) {
      hora.innerHTML = '<option value="">No hay horas disponibles hoy</option>';
    }

    if ([...hora.options].some(o => o.value === seleccionAnterior)) {
      hora.value = seleccionAnterior;
    }
  };

  fecha.addEventListener("change", cargarHoras);
  cargarHoras();

  // Solo números en el teléfono
  telefono.addEventListener("input", () => {
    telefono.value = telefono.value.replace(/[^0-9]/g, "").slice(0, 10);
  });

  // Quitar marca de error al corregir
  [nombre, telefono, servicio, fecha, hora].forEach(campo => {
    campo.addEventListener("input", () => campo.classList.remove("invalid"));
    campo.addEventListener("change", () => campo.classList.remove("invalid"));
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const errores = [];
    const marcar = (campo, texto) => {
      campo.classList.add("invalid");
      errores.push(texto);
    };

    if (nombre.value.trim().length < 3) marcar(nombre, "Escribe tu nombre.");
    if (!/^3\d{9}$/.test(telefono.value)) marcar(telefono, "Escribe un celular válido de 10 dígitos.");
    if (!servicio.value) marcar(servicio, "Selecciona un servicio.");
    if (!fecha.value) marcar(fecha, "Selecciona una fecha.");
    if (!hora.value) marcar(hora, "Selecciona una hora.");

    if (errores.length) {
      error.textContent = errores[0];
      return;
    }
    error.textContent = "";

    const [anio, mes, dia] = fecha.value.split("-");
    const fechaTexto = `${dia}/${mes}/${anio}`;

    let texto =
      "¡Hola Tres Corazones! 💖\n" +
      "Quiero agendar una cita:\n\n" +
      `👤 Nombre: ${nombre.value.trim()}\n` +
      `📱 Teléfono: ${telefono.value}\n` +
      `💄 Servicio: ${servicio.value}\n` +
      `📅 Fecha: ${fechaTexto}\n` +
      `🕒 Hora: ${hora.value}`;

    if (mensaje.value.trim()) {
      texto += `\n📝 Comentarios: ${mensaje.value.trim()}`;
    }

    window.open(crearEnlaceWhatsApp(texto), "_blank", "noopener");
    form.reset();
    cargarHoras();
  });
}
