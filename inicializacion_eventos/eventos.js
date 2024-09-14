const fs = require("fs").promises;
const path = require("path");
const chalk = require("chalk");

module.exports = async (client) => {
  const eventosPath = path.join(__dirname, "../bot/eventos");
  const files = await fs.readdir(eventosPath);
  console.log(chalk.bold.blue(`Se han iniciado correctamente todos los eventos.`))
  for (const file of files) {
    if (file.endsWith(".js")) {
      const eventName = file.slice(0, -3);
      console.log(`Evento Iniciado correctamente: ${eventName}`)
      client.on(eventName, require(path.join(eventosPath, file)).bind(null, client));
    }
  }
};