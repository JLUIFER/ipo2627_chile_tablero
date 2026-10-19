/*
  Controller del tablero: interacción Drag & Drop.
  Usa delegación de eventos sobre el contenedor del tablero, de modo que
  no hay que volver a registrar listeners cuando la vista redibuja las celdas.

  Contrato con la vista (HTML generado):
   - Cada celda:  data-drop-zone, data-row="<n>", data-col="<n>"
   - Cada ficha:  data-piece, draggable="true" (hija de una celda)
*/

export class TableroController {
  constructor(juego, vista) {
    this.juego = juego;
    this.vista = vista;
    this.tablero = document.querySelector('[data-element="board"]');
    this.botonReiniciarWin = document.querySelector('[data-action="win-restart"]');
    this.zonaActiva = null;

    this.init();
  }

  init() {
    this.tablero.addEventListener('dragstart', (e) => this.alIniciarArrastre(e));
    this.tablero.addEventListener('dragover', (e) => this.alPasarSobre(e));
    this.tablero.addEventListener('dragleave', (e) => this.alSalir(e));
    this.tablero.addEventListener('drop', (e) => this.alSoltar(e));
    this.tablero.addEventListener('dragend', (e) => this.alTerminarArrastre(e));

    // Evento del botón "Jugar de nuevo" en el modal de victoria
    if (this.botonReiniciarWin) {
      this.botonReiniciarWin.addEventListener('click', () => {
        this.juego.inicioJuego(); // 1. Resetea el tablero y pone esGameOver = false
        this.refrescar();         // 2. Redibuja y actualiza la visibilidad del modal
      });
    }

    this.refrescar();
  }

  alIniciarArrastre(e) {
    const ficha = e.target.closest('[data-piece]');
    if (!ficha || this.juego.getEsGameOver()) {
      e.preventDefault();
      return;
    }
    const origen = this.leerCoordenadas(ficha.closest('[data-drop-zone]'));
    if (!origen) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('text/plain', `${origen.fila},${origen.col}`);
    e.dataTransfer.effectAllowed = 'move';
    this.vista.marcarArrastre(ficha, true);
  }

  alPasarSobre(e) {
    const zona = e.target.closest('[data-drop-zone]');
    if (!zona) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (zona !== this.zonaActiva) {
      this.limpiarZonaActiva();
      this.zonaActiva = zona;
      this.vista.marcarDestino(zona, true);
    }
  }

  alSalir(e) {
    if (this.zonaActiva && !this.zonaActiva.contains(e.relatedTarget)) {
      this.limpiarZonaActiva();
    }
  }

  alSoltar(e) {
    const zona = e.target.closest('[data-drop-zone]');
    if (!zona) return;
    e.preventDefault();
    this.limpiarZonaActiva();

    const origen = this.parsearTransferencia(e.dataTransfer.getData('text/plain'));
    const destino = this.leerCoordenadas(zona);
    if (!origen || !destino) return;
    if (origen.fila === destino.fila && origen.col === destino.col) return;

    if (this.juego.mueveFicha(origen.fila, origen.col, destino.fila, destino.col)) {
      this.refrescar();
    }
  }

  alTerminarArrastre(e) {
    this.limpiarZonaActiva();
    const ficha = e.target.closest('[data-piece]');
    if (ficha) this.vista.marcarArrastre(ficha, false);
  }

  limpiarZonaActiva() {
    if (this.zonaActiva) {
      this.vista.marcarDestino(this.zonaActiva, false);
      this.zonaActiva = null;
    }
  }

  leerCoordenadas(celda) {
    if (!celda) return null;
    const fila = Number(celda.dataset.row);
    const col = Number(celda.dataset.col);
    return Number.isInteger(fila) && Number.isInteger(col) ? { fila, col } : null;
  }

  parsearTransferencia(texto) {
    const partes = texto.split(',').map(Number);
    if (partes.length !== 2 || !partes.every(Number.isInteger)) return null;
    const n = this.juego.getTamanoEstado();
    const [fila, col] = partes;
    const valido = fila >= 0 && fila < n && col >= 0 && col < n;
    return valido ? { fila, col } : null;
  }

  refrescar() {
    const esGanador = this.juego.getEsGameOver();
    this.vista.renderizar(this.juego.getEstadoTablero(), this.juego.getConfigPieza());
    this.vista.mostrarEstado(
      esGanador ? '¡Enhorabuena! Tablero completado' : 'Partida en curso'
    );
    // Pasa false a la vista cuando no hay victoria, aplicando hidden=true
    this.vista.mostrarVictoria(esGanador);
  }

}