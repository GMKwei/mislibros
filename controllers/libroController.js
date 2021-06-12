const libroService = require('../services/libroService.js');
const libroModel = require('../models/libro.js');
const trim = require('../funcionConEspacios.js'); //funcion para evitar campos vacios 
const express = require('express');
const app = express.Router();


//LIBRO----------------------------------------------------------

/* 10 - Post  <<<<<<<<<<<<<<<<<<

'/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, 
persona_id:numero/null} devuelve 200 y {id: numero, nombre:string, 
descripcion:string, categoria_id:numero, persona_id:numero/null} o bien 
status 413,  {mensaje: <descripcion del error>} que puede ser 
"error inesperado", "ese libro ya existe", "nombre y categoria son datos 
obligatorios", "no existe la categoria indicada", "no existe la persona indicada"*/

app.post('/libro', async (req, res) => {
    try {
        if (!req.body.nombre ||
            !req.body.descripcion ||
            !req.body.categoria_id) {
            throw new Error('Nombre y Categoría son datos obligatorios');
        }
        if (trim.conEspacios(req.body.nombre) ||
            trim.conEspacios(req.body.descripcion) ||
            trim.conEspacios(req.body.categoria_id) ){
            throw new Error('Los campos requeridos no pueden permanecer vacios');
        }
        
        let libro = {
            "nombre": req.body.nombre.toUpperCase(),
            "categoria_id": req.body.categoria_id,
            "descripcion": req.body.descripcion,
            "persona_id": req.body.persona_id,
            "subtitulo": req.body.subtitulo,
            "rating": req.body.rating
        }

        let respuesta = await libroService.nuevoLibro(libro);
        res.status(200).send('El libro ' + libro.nombre + ' se agrego con exito');

        }catch (e) {   
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 11 - Get <<<<<<<<<<<<<<<<<<

GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null}] o bien 413,
{mensaje: <descripcion del error>} "error inesperado" */

app.get('/libro', async (req, res) => {
    try {
        let respuesta = await libroModel.listaLibros();
        res.status(200).send({
            respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });

    }
});




/* 12 - Get ID <<<<<<<<<<<<<<<<<<<

GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null} y status 413, {mensaje: 
<descripcion del error>} "error inesperado", "no se encuentra ese libro" */

app.get('/libro/:id', async (req, res) => {
    try {
        let respuesta = await libroModel.libroId(req.params.id);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra ese libro');
        }
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 13 - Put ID <<<<<<<<<<<<<<<<<<<

'/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero,
 persona_id:numero/null} devuelve status 200 y {id: numero, nombre:string, 
 descripcion:string, categoria_id:numero, persona_id:numero/null} modificado o 
 bien status 413, {mensaje: <descripcion del error>} "error inesperado",  
 "solo se puede modificar la descripcion del libro" */

app.put('/libro/:id', async (req, res) => {
    try {
        console.log(req.params.id, req.body)
        if (!req.params.id ||
            !req.body.nombre ||
            !req.body.descripcion ||
            !req.body.categoria_id
            ) {
            throw new Error('Los datos requeridos son obligatorios');
        }
        // if (trim.conEspacios(req.params.id) ||
        //     trim.conEspacios(req.body.nombre) ||
        //     trim.conEspacios(req.body.descripcion) ||
        //     trim.conEspacios(req.body.categoria_id) 
        //     ) {
        //     throw new Error('Los campos requeridos no pueden permanecer vacios');
        // }
        let libro = {
            "nombre": req.body.nombre.toUpperCase(),
            "categoria_id": req.body.categoria_id,
            "descripcion": req.body.descripcion,
            "persona_id": req.body.persona_id,
            "id": req.params.id             
        }

        let respuesta = await libroService.libroUpdate(libro);
        res.status(200).send({
            'id': libro.id,
            'nombre': libro.nombre,
            'descripcion': libro.descripcion,
            'categoria_id': libro.categoria_id,
            'persona_id': libro.persona_id
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }

})

/* 14 - Put prestar ID <<<<<<<<<<<<<<<<<<<

'/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y 
{mensaje: "se presto correctamente"} o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra 
prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", 
"no se encontro la persona a la que se quiere prestar el libro" */

app.put('/libro/prestar/:id', async (req, res) => {
    try {
        if (!req.body.id ||
            !req.body.persona_id) {
            throw new Error('Los datos requeridos son obligatorios');
        }
        if (trim.conEspacios(req.body.id) ||
            trim.conEspacios(req.body.persona_id)) {
            throw new Error('Los campos requeridos no pueden permanecer vacios');
        }
        let datos = {
            "id": req.body.id,
            "persona_id": req.body.persona_id,
            "id_params": req.params.id
        }

        let respuesta = await libroService.prestarLibro(datos);
        res.status(200).send({
            "respuesta": "El libro se presto correctamente"
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }

});

/* 15 - Put devolver ID <<<<<<<<<<<<<<<<<<< 

'/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion 
correctamente"} o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "ese libro no estaba prestado!", "ese libro no existe" */

app.put('/libro/devolver/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let respuesta = await libroService.devolverLibro(id);

        res.status(200).send({
            "respuesta": "El libro fue devuelto correctamente"
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }
});

/* 16 - Delete ID 

'/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  
o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "no se encuentra ese libro", "ese libro esta prestado no 
se puede borrar" */

app.delete("/libro/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let respuesta = await libroService.borrarLibro(id);

        res.status(200).send({
            respuesta: "Se borro correctamente",
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

module.exports = app;