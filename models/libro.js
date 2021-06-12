const conexion = require('../db.js');

module.exports = {
    nombreLibro: async (nombre) => {
        let respuesta = await conexion.query(
            'SELECT nombre FROM libros WHERE nombre = ?', [nombre]);
        return respuesta;
    },
    libroId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT * FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    categoriaId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT categoria_id FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    personaId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT persona_id FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    nombreId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT nombre FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    nuevoLibro: async (libro) => {
        let respuesta = await conexion.query(
            'INSERT INTO libros (nombre, descripcion, categoria_id, persona_id, subtitulo, rating) VALUE (?,?,?,?,?,?)', [libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id, libro.subtitulo, libro.rating]);
        return respuesta;
    },
    listaLibros: async () => {
        let respuesta = await conexion.query(
            'SELECT * FROM libros');
        return respuesta;
    },
    actualizarLibro: async (libro) => {
        let respuesta = await conexion.query('UPDATE libros SET descripcion = ? WHERE id = ?', [libro.descripcion, libro.id]);
        return respuesta;
    },
    prestarLibro: async (datos) => {
        let respuesta = await conexion.query('UPDATE libros SET persona_id = ? WHERE id = ?', [datos.persona_id, datos.id]);
        return respuesta;
    },
    devolverLibro: async (id) => {
        let respuesta = await conexion.query('UPDATE libros SET persona_id = ? WHERE id = ?', [null, id]);
        return respuesta;
    },
    borrarLibro: async (id) => {
        let respuesta = await conexion.query("DELETE FROM libros WHERE id = ?", [id]);
    }
}