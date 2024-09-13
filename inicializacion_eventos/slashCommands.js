const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { readdir } = require("fs").promises;
const chalk = require("chalk");

module.exports = async (client) => {

  async function subFolder(folder) {
    const files = await readdir(`./bot/comandos/${folder}`);
    for (const file of files) {
      if (file.endsWith(".js")) {
        const fileContents = require(`../bot/comandos/${folder}/${file}`);
        await client.slash.set(fileContents.data.name, fileContents);
        await client.dataArray.push(fileContents.data.toJSON());
      }
    }
  }

  const folders = ["admin", "info", "owner", "sistemas", "ticket"];
  for (const folder of folders) {
    await subFolder(folder);
  }

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

  await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
    body: client.dataArray,
  });

  console.log(chalk.bold.blue(`Se han iniciado correctamente todos los slash.`))
}
