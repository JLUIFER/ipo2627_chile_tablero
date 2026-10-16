
/* 
Este controller gestiona la captura de eventos del panel de configuración, 
la apertura y cierre del menú desplegable, y 
la comunicación de las opciones de personalización hacia el modelo y la vista 
*/

export class panelConfiguracionController {
  constructor (juego , vista){
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

  init(){
    this.botonAbrir.addEventListener('click', () => this.alternarPanel());
    this.botonCerrar.addEventListener('click', () => this.cerrarPanel());

    this.inputTamano.addEventListener('change', (e) => this.cambiaTamanoTablero(e));
    this.selectTamanoPieza.addEventListener('change', (e) => this.cambiaTamanoPieza(e));
    this.selectFormaPieza.addEventListener('change', (e) => this.cambiaFormaPieza(e));
    this.inputHue.addEventListener('input', (e) => this.cambiaHue(e));

    this.botonReiniciar.addEventListener('click', () => this.reiniciarPartida());
  }


}