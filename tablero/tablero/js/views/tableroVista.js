/*
  Vista: solo toca el DOM. No contiene lógica de juego.
  Los atributos data-* que escribe son los que usa el CSS y los controllers.
*/
export class TableroVista {
  constructor() {
    this.tablero = document.querySelector('[data-element="board"]');
    this.estado = document.querySelector('[data-element="status"]');
    this.modalVictoria = document.querySelector('[data-element="win-modal"]');
  }

  renderizar(matriz, config) {
    const n = matriz.length;
    this.tablero.style.setProperty('--grid-size', n);
    document.documentElement.style.setProperty('--hue-base', config.hue);

    const celdas = [];
    matriz.forEach((fila, r) => {
      fila.forEach((tipo, c) => {
        const celda = document.createElement('div');
        celda.className = 'board-cell';
        celda.setAttribute('data-drop-zone', '');
        celda.dataset.row = r;
        celda.dataset.col = c;

        const ficha = document.createElement('div');
        ficha.className = 'piece';
        ficha.setAttribute('data-piece', '');
        ficha.draggable = true;
        ficha.dataset.type = tipo;
        ficha.dataset.size = config.tamano;
        ficha.dataset.shape = config.forma;

        celda.append(ficha);
        celdas.push(celda);
      });
    });
    this.tablero.replaceChildren(...celdas);
  }

  mostrarEstado(texto) {
    this.estado.textContent = texto;
  }

 mostrarVictoria(visible) {
    if (this.modalVictoria) {
      this.modalVictoria.hidden = !visible;
    }
  }

  marcarArrastre(ficha, activo) {
    ficha.classList.toggle('is-dragging', activo);
  }

  marcarDestino(celda, activo) {
    celda.classList.toggle('is-over', activo);
  }
}