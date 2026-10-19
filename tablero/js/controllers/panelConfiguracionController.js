
/* 
Este controller gestiona la captura de eventos del panel de configuración, 
la apertura y cierre del menú desplegable, y 
la comunicación de las opciones de personalización hacia el modelo y la vista 
*/

/*
  Controller del panel de configuración.
  Responsabilidades:
   - Abrir/cerrar el panel lateral (estado en data-state, accesible con teclado).
   - Recoger los controles de configuración y trasladarlos al modelo.
   - Pedir a la vista que se redibuje: cualquier cambio crea un tablero nuevo.
*/

export class PanelConfiguracionController {
  constructor(juego, vista) {
    this.juego = juego;
    this.vista = vista;

    this.panel = document.querySelector('[data-element="controls-panel"]');
    this.botonAbrir = document.querySelector('[data-action="toggle-menu"]');
    this.botonCerrar = document.querySelector('[data-action="close-menu"]');
    this.botonReiniciar = document.querySelector('[data-action="restart"]');

    this.inputTamano = document.querySelector('[data-control="board-size"]');
    this.selectTamanoPieza = document.querySelector('[data-control="piece-size"]');
    this.selectFormaPieza = document.querySelector('[data-control="piece-shape"]');
    this.inputHue = document.querySelector('[data-control="hue"]');

    this.init();
  }

  init() {
    this.botonAbrir.addEventListener('click', () => this.alternarPanel());
    this.botonCerrar.addEventListener('click', () => this.cerrarPanel());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.estaAbierto()) this.cerrarPanel();
    });

    this.inputTamano.addEventListener('change', (e) => this.cambiaTamanoTablero(e));
    this.selectTamanoPieza.addEventListener('change', (e) => this.cambiaTamanoPieza(e));
    this.selectFormaPieza.addEventListener('change', (e) => this.cambiaFormaPieza(e));
    // 'change' (al soltar) y no 'input': el modelo crea tablero nuevo en cada cambio
    // y no queremos reiniciar la partida decenas de veces mientras se arrastra el slider.
    this.inputHue.addEventListener('change', (e) => this.cambiaHue(e));

    this.botonReiniciar.addEventListener('click', () => this.reiniciarPartida());

    this.cerrarPanel(); // estado inicial coherente con atributos ARIA e inert
  }

  /* ---------- Apertura / cierre ---------- */

  estaAbierto() {
    return this.panel.dataset.state === 'expanded';
  }

  alternarPanel() {
    this.estaAbierto() ? this.cerrarPanel() : this.abrirPanel();
  }

  abrirPanel() {
    this.panel.dataset.state = 'expanded';
    this.panel.inert = false;
    this.botonAbrir.setAttribute('aria-expanded', 'true');
    this.inputTamano.focus();
  }

  cerrarPanel() {
    const eraAbierto = this.estaAbierto();
    this.panel.dataset.state = 'collapsed';
    this.panel.inert = true; // fuera del orden de tabulación y del árbol de accesibilidad
    this.botonAbrir.setAttribute('aria-expanded', 'false');
    if (eraAbierto) this.botonAbrir.focus();
  }

  /* ---------- Cambios de configuración ---------- */

  cambiaTamanoTablero(e) {
    const min = Number(this.inputTamano.min) || 3;
    const max = Number(this.inputTamano.max) || 8;
    const n = parseInt(e.target.value, 10);

    if (!Number.isInteger(n) || n < min || n > max) {
      // valor inválido: se restaura el último válido y no se toca el modelo
      this.inputTamano.value = this.juego.getTamanoEstado();
      return;
    }
    this.juego.setTamanoTablero(n);
    this.refrescar();
  }

  cambiaTamanoPieza(e) {
    this.juego.setTamanoPieza(e.target.value);
    this.refrescar();
  }

  cambiaFormaPieza(e) {
    this.juego.setFormaPieza(e.target.value);
    this.refrescar();
  }

  cambiaHue(e) {
    this.juego.setHue(Number(e.target.value));
    this.refrescar();
  }

  reiniciarPartida() {
    this.juego.inicioJuego();
    this.refrescar();
  }

  /* ---------- Comunicación con la vista ---------- */

  refrescar() {
    this.vista.renderizar(this.juego.getEstadoTablero(), this.juego.getConfigPieza());
    this.vista.mostrarEstado('Partida en curso');
    this.vista.mostrarVictoria(false); // Oculta el modal de victoria si estaba visible
  }
}