const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = async () => {
  await mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(chalk.bold.yellow(`La Base de Datos se ha iniciado con éxito.`))
};