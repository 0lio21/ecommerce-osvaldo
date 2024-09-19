const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Sirve los archivos estáticos del directorio "public"
app.use(express.static('public'));

// Ruta para cargar productos desde archivo JSON
app.get('/api/productos', (req, res) => {
    fs.readFile('productos.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error al leer el archivo JSON' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
