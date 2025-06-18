# Detector de Diferenças em Imagens

Este projeto é uma aplicação web simples que compara duas imagens PNG e destaca visualmente as diferenças entre elas. O objetivo é identificar alterações ou peças faltantes em uma imagem em relação à original, com uma interface acessível e uma explicação matemática didática.

## Funcionalidade

- O usuário envia **duas imagens PNG**:
  - A original
  - A imagem com peça faltando ou alterada
- O sistema processa as imagens pixel a pixel e gera uma imagem de saída (`diferenca.png`) com **diferenças destacadas em vermelho**.
- O sistema também exibe a **quantidade de pontos alterados** e um exemplo de coordenada com diferença.

## Lógica de Comparação

A comparação é feita usando a seguinte fórmula:

`diff(x, y) = |R1 - R2| + |G1 - G2| + |B1 - B2|`


Se `diff > 50`, o ponto é considerado diferente e é marcado em vermelho na imagem resultante.

## Tecnologias Utilizadas

- **Frontend:**
  - HTML5, CSS3
  - JavaScript (DOM API)

- **Backend:**
  - Node.js + Express
  - Multer (upload de arquivos)
  - PNGJS (leitura e manipulação de arquivos PNG)

## Estrutura do Projeto
```
deteccao-de-diferentes-imagens/  
├── public/  
│ ├── index.html  
│ ├── explicacao.html  
│ ├── style.css  
│ └── script.js  
├── uploads/ # Imagens temporárias (gerenciadas pelo multer)
├── output/ # Imagem de saída com diferenças
├── server.js # Backend em Node.js
├── package.json
└── README.md
```

## Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/GabrielFrois/deteccao-de-diferentes-imagens.git
cd deteccao-de-diferentes-imagens
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor
```bash
npm run start
```

Acesse: `http://localhost:3000`

## Requisitos
As imagens devem estar no formato PNG e com o mesmo tamanho (largura x altura).  
Caso contrário, um erro será exibido.
