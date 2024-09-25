const express = require('express');
const fs = require('fs');
const mercadopago = require('mercadopago');  // Importar Mercado Pago

const app = express();
const port = 3005;

// Configurar Mercado Pago
//mercadopago.configure({
  //  access_token: ''  // Reemplaza 'YOUR_ACCESS_TOKEN'
//});

app.use(express.static('public'));
app.use(express.json());

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

// Ruta para crear preferencia de pago de Mercado Pago
app.post('/create_preference', (req, res) => {
    const items = req.body.items;

    const preference = {
        items: items.map(item => ({
            title: item.title,
            unit_price: item.unit_price,
            quantity: item.quantity
        })),
        back_urls: {
            success: 'https://www.tu-tienda.com/success',
            failure: 'https://www.tu-tienda.com/failure',
            pending: 'https://www.tu-tienda.com/pending'
        },
        auto_return: 'approved',
    };

    // Crear la preferencia de pago
    mercadopago.preferences.create(preference)
        .then(response => {
            res.json({ id: response.body.id });  // Enviar el ID de la preferencia al frontend
        }).catch(error => {
            console.error('Error al crear la preferencia de pago:', error);
            res.status(500).send('Error al crear la preferencia de pago');
        });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
