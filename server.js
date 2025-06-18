const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/output", express.static("output"));

const upload = multer({ dest: "uploads/" });

app.post("/comparar", upload.fields([{ name: "imagem1" }, { name: "imagem2" }]), (req, res) => {
  const img1Path = req.files.imagem1[0].path;
  const img2Path = req.files.imagem2[0].path;

  const ext1 = path.extname(req.files.imagem1[0].originalname).toLowerCase();
  const ext2 = path.extname(req.files.imagem2[0].originalname).toLowerCase();

  // Verifica extensões
  if (ext1 !== ".png" || ext2 !== ".png") {
    fs.unlinkSync(img1Path);
    fs.unlinkSync(img2Path);
    return res.send("<h2>Erro: As imagens devem estar no formato PNG.</h2><a href='/'>Voltar</a>");
  }

  // Cria os parsers e trata erro se o arquivo não for um PNG válido
  const img1Parser = new PNG();
  const img2Parser = new PNG();

  img1Parser.on("parsed", doneReading);
  img2Parser.on("parsed", doneReading);

  img1Parser.on("error", handleParseError);
  img2Parser.on("error", handleParseError);

  fs.createReadStream(img1Path).pipe(img1Parser);
  fs.createReadStream(img2Path).pipe(img2Parser);

  let filesRead = 0;

  function handleParseError(err) {
    console.error("Erro ao processar PNG:", err.message);
    if (fs.existsSync(img1Path)) fs.unlinkSync(img1Path);
    if (fs.existsSync(img2Path)) fs.unlinkSync(img2Path);

    res.send(`
      <h2>Erro ao processar o arquivo.</h2>
      <p>Certifique-se de que ambos os arquivos enviados estejam no formato <strong>PNG</strong> e não estejam corrompidos.</p>
    `);
  }

  function doneReading() {
    if (++filesRead < 2) return;

    if (img1Parser.width !== img2Parser.width || img1Parser.height !== img2Parser.height) {
      fs.unlinkSync(img1Path);
      fs.unlinkSync(img2Path);
      return res.send("<h2>Erro: As imagens devem ter o mesmo tamanho.</h2><a href='/'>Voltar</a>");
    }

    const { width, height } = img1Parser;
    const threshold = 50;
    let coords = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;

        const r1 = img1Parser.data[idx];
        const g1 = img1Parser.data[idx + 1];
        const b1 = img1Parser.data[idx + 2];

        const r2 = img2Parser.data[idx];
        const g2 = img2Parser.data[idx + 1];
        const b2 = img2Parser.data[idx + 2];

        const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

        if (diff > threshold) {
          img1Parser.data[idx] = 255;
          img1Parser.data[idx + 1] = 0;
          img1Parser.data[idx + 2] = 0;
          img1Parser.data[idx + 3] = 200;
          coords.push({ x, y });
        }
      }
    }

    img1Parser.pack().pipe(fs.createWriteStream("output/diferenca.png")).on("finish", () => {
      fs.unlinkSync(img1Path);
      fs.unlinkSync(img2Path);

      const html = `
        <h2>Resultado:</h2>
        <img src="/output/diferenca.png?${Date.now()}" width="500" />
        <p>Total de pontos com diferença: ${coords.length}</p>
        <p>Exemplo de coordenada com diferença: ${
          coords.length > 0 ? JSON.stringify(coords[0]) : "Nenhuma diferença significativa"
        }</p>
        <div id="coords"></div>
      `;
      res.send(html);
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
