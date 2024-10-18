# RAFAELA & ALBERSON

[![Netlify Status](https://api.netlify.com/api/v1/badges/c79d0049-4426-409a-be09-d43b5c3a70a4/deploy-status)](https://app.netlify.com/sites/rafaelaalberson/deploys)

## Estrutura do Repositório

```
📦wedding_site
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┃ ┗ 📜favicon.ico
 ┃ ┃ ┗ 📂img
 ┃ ┃ ┃ ┣ 📂presentes
 ┃ ┣ 📂js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜qr_code.js
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜style.css
 ┃ ┗ 📂templates
 ┃ ┃ ┣ 📜gifts.html
 ┃ ┃ ┣ 📜index.html
 ┃ ┃ ┗ 📜prendas.html
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜webpack.config.js
```

## Uso

Para rodar o projeto, basta executar o comando `npm start` no terminal. O projeto será executado no endereço `http://localhost:8080/`.

## Dependências

- qrcode-pix: Biblioteca para geração de QR Codes para pagamentos via PIX.
- webpack: Empacotador de módulos JavaScript.
- webpack-cli: Interface de linha de comando para o Webpack.
