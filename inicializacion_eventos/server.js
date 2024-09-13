const express = require('express');
const app = express();
const chalk = require("chalk");

app.use(express.static("./extras/pagina"));

module.exports = () => {
  console.log(chalk.bold.blue(`Página web iniciada con éxito.`))
  app.listen(3000);
  return true;
};