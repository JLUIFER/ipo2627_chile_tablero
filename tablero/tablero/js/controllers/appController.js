/*
  Punto de entrada: crea modelo y vista y los conecta con los controllers.
*/
import { Juego } from '../models/juego.js';
import { TableroVista } from '../views/tableroVista.js';
import { TableroController } from './tableroController.js';
import { PanelConfiguracionController } from './panelConfiguracionController.js';
import { AyudaController } from './ayudaController.js';

const juego = new Juego();
const vista = new TableroVista();

new TableroController(juego, vista);
new PanelConfiguracionController(juego, vista);
new AyudaController();