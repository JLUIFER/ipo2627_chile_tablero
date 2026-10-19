
/*
  Modelo: estado y reglas del juego. No conoce el DOM.
*/

// Tres tipos de ficha (el CSS les asigna color mediante data-type)
const TIPOS = ['primary', 'secondary', 'tertiary'];
const TAMANO_MINIMO = 3;

export class Juego {
  constructor(tamanoTablero = TAMANO_MINIMO) {
    this.tamanoTablero = tamanoTablero;
    this.tamanoPieza = 'medium';
    this.formaPieza = 'circle';   // debe coincidir con data-shape del CSS
    this.hue = 210;
    this.tablero = [];
    this.esGameOver = false;

    this.inicioJuego();
  }

  /*
    Reparto resoluble: cada fila "reserva" un tipo (fila r -> TIPOS[r % 3]), así el
    número de fichas de cada tipo es siempre múltiplo de N y existe al menos una
    ordenación ganadora, para cualquier N >= 3. Después se mezclan todas las fichas.
    Se repite el sorteo si el tablero sale ya resuelto.
  */
  inicioJuego() {
    const n = this.tamanoTablero;
    do {
      const piezas = [];
      for (let r = 0; r < n; r++) {
        const tipo = TIPOS[r % TIPOS.length];
        for (let c = 0; c < n; c++) piezas.push(tipo);
      }
      this.shuffle(piezas);
      this.tablero = Array.from({ length: n }, (_, r) =>
        piezas.slice(r * n, (r + 1) * n));
    } while (this.tableroResuelto());
    this.esGameOver = false;
  }

  // Fisher-Yates
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Solo consulta: true si todas las filas son de un único tipo (sin efectos secundarios)
  tableroResuelto() {
    return this.tablero.every((fila) => fila.every((tipo) => tipo === fila[0]));
  }

  // Actualiza el estado de fin de partida a partir del tablero actual
  checkEsGanador() {
    this.esGameOver = this.tableroResuelto();
    return this.esGameOver;
  }

  coordenadaValida(fila, col) {
    const n = this.tamanoTablero;
    return Number.isInteger(fila) && Number.isInteger(col) &&
           fila >= 0 && fila < n && col >= 0 && col < n;
  }

  // Intercambia dos celdas. Devuelve true solo si el movimiento se realizó.
  mueveFicha(fromFila, fromColumna, toFila, toColumna) {
    if (this.esGameOver) return false;
    if (!this.coordenadaValida(fromFila, fromColumna) ||
        !this.coordenadaValida(toFila, toColumna)) return false;
    if (fromFila === toFila && fromColumna === toColumna) return false;

    const t = this.tablero;
    [t[fromFila][fromColumna], t[toFila][toColumna]] =
      [t[toFila][toColumna], t[fromFila][fromColumna]];

    this.checkEsGanador();
    return true;
  }

  // Cualquier cambio de configuración genera un tablero nuevo (enunciado)

  setTamanoTablero(tam) {
    if (Number.isInteger(tam) && tam >= TAMANO_MINIMO) {
      this.tamanoTablero = tam;
      this.inicioJuego();
    }
  }

  setTamanoPieza(tam) {
    this.tamanoPieza = tam;
    this.inicioJuego();
  }

  setFormaPieza(forma) {
    this.formaPieza = forma;
    this.inicioJuego();
  }

  setHue(hue) {
    this.hue = hue;
    this.inicioJuego();
  }

  getEstadoTablero() {
    return this.tablero;
  }

  getTamanoEstado() {
    return this.tamanoTablero;
  }

  getConfigPieza() {
    return { tamano: this.tamanoPieza, forma: this.formaPieza, hue: this.hue };
  }

  getEsGameOver() {
    return this.esGameOver;
  }
}