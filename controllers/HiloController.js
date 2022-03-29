const HiloModel = require('../models/hilo.js');
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Hilo donde contiene todos los metodos(funciones de clases llaman metodos).

class Hilo {
    constructor() {
    }

    // Función mostrar todos los Hilos.
    async traerHilos() {
        let hilosEncontrados = await HiloModel.find().then(hilo => {
            return { status: 200, datos: hilo }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return hilosEncontrados;
    }

    // Función mostrar un Hilo por ID.
    async traerHiloId(id) {
        let hiloEncontrado = await HiloModel.findById(id).then(hilo => {
            return { status: 200, datos: hilo }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return hiloEncontrado;
    }









}


let HiloController = new Hilo();
module.exports = HiloController;