const express = require('express');
const app = express();
const path = require('path');
const db = require('better-sqlite3');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Servir HTML/CSS/JS da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de check-in
app.post('/api/checkin', (req, res) => {
  const {
    name, birthDate, birthPlace, nationality,
    residencePlace, residenceCountry,
    documentType, documentNumber, documentIssuer,
    checkinDate, checkoutDate
  } = req.body;

  db.run(`
    INSERT INTO Hospedes (
      Nome, DataNascimento, LocalNascimento, Nacionalidade,
      LocalResidencia, PaisResidencia, TipoDocumento, NumeroDocumento,
      PaisEmissor, DataCheckin, DataCheckout
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name, birthDate, birthPlace, nationality,
    residencePlace, residenceCountry,
    documentType, documentNumber, documentIssuer,
    checkinDate, checkoutDate
  ], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao guardar check-in' });
    }
    res.status(200).json({ message: 'Check-in guardado com sucesso!' });
  });
});

app.get("/listar", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM hospedes");
    const dados = stmt.all();
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao obter os dados");
  }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
