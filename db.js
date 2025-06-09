const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para base de dados SQLite
const dbPath = path.join(__dirname, 'anita.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Ligado ao SQLite com sucesso!');
    db.run(`
      CREATE TABLE IF NOT EXISTS Hospedes (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT,
        DataNascimento TEXT,
        LocalNascimento TEXT,
        Nacionalidade TEXT,
        LocalResidencia TEXT,
        PaisResidencia TEXT,
        TipoDocumento TEXT,
        NumeroDocumento TEXT,
        PaisEmissor TEXT,
        DataCheckin TEXT,
        DataCheckout TEXT
      )
    `);
  }
});

module.exports = db;
