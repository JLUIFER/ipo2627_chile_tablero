

export class Juego {
    constructor(tamanoTablero = 3) {
        this.tamanoTablero = tamanoTablero;
        this.tamanoPieza = 'medium';
        this.formaPieza = 'circulo';
        this.hue = 210;
        this.tablero = [];
        this.esGameOver = false;

        this.inicioJuego();
    }

    inicioJuego() {
        this.esGameOver = false;
        const tiposFicha = ['primary', 'secondary', 'tertiary'];
        const numTotalCeldas = this.tamanoTablero * this.tamanoTablero;
        const piezas = [];

        for (let i = 0; i < numTotalCeldas; i++) {
            //La operación i % types.length distribuye de forma equitativa los 3 tipos de fichas a lo largo de las celdas
            piezas.push(tiposFicha[i % tiposFicha.length]);
        }

        this.shuffle(piezas);

        this.tablero = [];
        for (let r = 0; r < this.tamanoTablero; r++) {
            const fila = [];
            for (let c = 0; c < this.tamanoTablero; c++) {
                fila.push(piezas[r * this.tamanoTablero + c])
            }
            this.tablero.push(fila);
        }

    }

    //implementa el algoritmo de Fisher-Yates para mezclar el array unidimensional de fichas de manera imparcial
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // con este metodo podemos intercambiar la posicion de las fichas

    mueveFicha(fromFila, fromColumna, toFila, toColumna) {
        if (this.esGameOver) return false;
        const temp = this.tablero[fromFila][fromColumna];
        this.tablero[fromFila][fromColumna] = this.tablero[toFila][toColumna]
        this.tablero[toFila][toColumna] = temp;
        this.checkEsGanador();
        return true;
    }
    // Revisa el tablero fila por fila. Toma el primer elemento de la fila this.board[r][0] como referencia y lo compara con todas las demás columnas c de esa misma fila. Si encuentra un elemento diferente, se detiene e indica que no hay victoria (return false). 
    // Si recorre todas las filas sin encontrar diferencias dentro de ninguna de ellas, marca isGameOver = true
    checkEsGanador() {
        for (let r = 0; r < this.tamanoTablero; r++) {
            const primerTipo = this.tablero[r][0];
            for (let c = 1; c < this.tamanoTablero; c++) {
                if (this.tablero[r][c] !== primerTipo) {
                    this.esGameOver = false;
                    return false;
                }
            }
        }
        this.esGameOver = true;
        return true;
    }

    // metodos para cambiar parametros 

    setTamanoTablero (tam){
        if (tam >= 3){
            this.tamanoTablero = tam
            this.inicioJuego();
        }
    }

    setTamanoPieza (tam){
        this.tamanoPieza = tam;
        this.inicioJuego();
    }

    setFormaPieza (forma){
        this.formaPieza = forma;
        this.inicioJuego();
    }

    setHue (hue){
        this.hue = hue;
        this.inicioJuego();
    }

    getEstadoTablero(){
        return this.tablero;
    }

    getTamanoEstado(){
        return this.tamanoTablero;
    }

    getConfigPieza(){
        return {
            tamano : this.tamanoPieza,
            forma: this.formaPieza,
            hue: this.hue,
        };
    }

    getEsGameOver(){
        return this.esGameOver;
    }
}