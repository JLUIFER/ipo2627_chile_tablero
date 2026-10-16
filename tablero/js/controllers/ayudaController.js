/*
  Controller del botón "Mecánica del Juego".
  - Hover/foco: el tooltip lo resuelve CSS (position: absolute).
  - Clic: muestra u oculta la tarjeta de instrucciones (atributo hidden).
  No necesita el modelo: es información estática.
*/

export class AyudaController {
  constructor() {
    this.boton = document.querySelector('[data-action="help"]');
    this.tarjeta = document.querySelector('[data-element="help-info"]');
    this.init();
  }

  init() {
    this.boton.setAttribute('aria-expanded', 'false');
    this.boton.addEventListener('click', () => this.alternar());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.tarjeta.hidden) this.ocultar();
    });
  }

  alternar() {
    this.tarjeta.hidden ? this.mostrar() : this.ocultar();
  }

  mostrar() {
    this.tarjeta.hidden = false;
    this.boton.setAttribute('aria-expanded', 'true');
  }

  ocultar() {
    this.tarjeta.hidden = true;
    this.boton.setAttribute('aria-expanded', 'false');
  }
}