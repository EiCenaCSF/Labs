const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o Multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Rota para upload de transcripts
app.post('/upload', upload.single('transcript'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  // URL pública do arquivo (ajuste conforme seu host)
  const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;

  res.json({ 
    success: true,
    url: fileUrl 
  });
});

// Rota para acessar arquivos (ex: http://seuservidor.com/files/arquivo.html)
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});""