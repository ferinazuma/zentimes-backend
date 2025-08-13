require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Prueba conexión base de datos
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL exitosa.'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Zentimes API en marcha 🚀' });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
