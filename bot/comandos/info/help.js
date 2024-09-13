const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const permissions = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Comando de ayuda")
    .addStringOption(option => option
      .setName("comando")
      .setDescription("Ver ayuda de un comando")),
  category: "info",
  name: "help",
  execute: async (interaction, client) => {
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.AddReactions))
      return interaction.reply({ embeds: [permissions.handleReactionsBot()], ephemeral: true });

    const commandsByCategory = {
      mod: client.slash.filter((cmd) => cmd.category === "mod"),
      info: client.slash.filter((cmd) => cmd.category === "info"),
      owner: client.slash.filter((cmd) => cmd.category === "owner"),
      systems: client.slash.filter((cmd) => cmd.category === "systems"),
      tickets: client.slash.filter((cmd) => cmd.category === "tickets"),

    };

    if (interaction.options.getString("comando")) {
      const command = await client.slash.get(interaction.options.getString("comando"));

      if (!command)
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription("Comando invalido: " + interaction.options.getString("comando"))
            .setColor("Red")
          ], ephemeral: true
        });

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`**❯ Descripción:**\n${command.description || "No hay descripción."}\n**❯ Uso:**\n ${command.usage.replace(/\$\{PREFIX\}/g, "/") || "Uso no disponible."}`)
          .setColor("Green")
        ], ephemeral: true
      });
    } else {
      const startingRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setEmoji('<:herramientas:1144616301042602096>')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ButtonNo2'),
          new ButtonBuilder()
            .setEmoji("<:verificadonaranja:1144615882807591085>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo3"),
          new ButtonBuilder()
            .setEmoji("<:creador:1144616240371990689>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo4"),
          new ButtonBuilder()
            .setEmoji("⚙️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo5"),
          new ButtonBuilder()
            .setEmoji("🎫")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo6")
        );

      const indexEmbed = new EmbedBuilder()
        .setTitle("🌎 Menú de Inicio")
        .setDescription("**🌎 Inicio\n<:herramientas:1144616301042602096> Moderación\n<:verificadonaranja:1144615882807591085> Información\n<:creador:1144616240371990689> Dueño\n⚙️ Sistemas\n🎫Tickets**")
        .setColor("Green");

      const modEmbed = new EmbedBuilder()
        .setTitle("<:herramientas:1144616301042602096> Comandos de Moderación")
        .setDescription(commandsByCategory.mod.map(withAliases).join("\n") || "No hay comandos.")
        .setColor("Green");

      const infoEmbed = new EmbedBuilder()
        .setTitle("<:verificadonaranja:1144615882807591085> Comandos de Información")
        .setDescription(commandsByCategory.info.map(withAliases).join("\n") || "No hay comandos.")
        .setColor("Green");

      const ownerEmbed = new EmbedBuilder()
        .setTitle("<:creador:1144616240371990689> Comandos de Dueño")
        .setDescription(commandsByCategory.owner.map(withAliases).join("\n") || "No hay comandos.")
        .setColor("Green");

      const systemsEmbed = new EmbedBuilder()
        .setTitle("⚙️ Comandos de Sistemas")
        .setDescription(commandsByCategory.systems.map(withAliases).join("\n") || "No hay comandos.")
        .setColor("Green");

      const ticketsEmbed = new EmbedBuilder()
        .setTitle("🎫 Comandos de Tickets")
        .setDescription(commandsByCategory.tickets.map(withAliases).join("\n") || "No hay comandos.")
        .setColor("Green");

      const m = await interaction.reply({ embeds: [indexEmbed], components: [startingRow], ephemeral: true });

      const buttonEmbedMap = {
        ButtonNo1: indexEmbed,
        ButtonNo2: modEmbed,
        ButtonNo3: infoEmbed,
        ButtonNo4: ownerEmbed,
        ButtonNo5: systemsEmbed,
        ButtonNo6: ticketsEmbed,
      };

      const buttonRowMap = {
        ButtonNo1: startingRow,
        ButtonNo2: new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji('🌎')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo1'),
            new ButtonBuilder()
              .setEmoji("<:verificadonaranja:1144615882807591085>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo3"),
            new ButtonBuilder()
              .setEmoji("<:creador:1144616240371990689>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo4"),
            new ButtonBuilder()
              .setEmoji("⚙️")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo5"),
            new ButtonBuilder()
              .setEmoji("🎫")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo6")
          ),
        ButtonNo3: new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji('🌎')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo1'),
            new ButtonBuilder()
              .setEmoji('<:herramientas:1144616301042602096>')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo2'),
            new ButtonBuilder()
              .setEmoji("<:creador:1144616240371990689>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo4"),
            new ButtonBuilder()
              .setEmoji("⚙️")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo5"),
            new ButtonBuilder()
              .setEmoji("🎫")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo6")
          ),
        ButtonNo4: new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji('🌎')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo1'),
            new ButtonBuilder()
              .setEmoji('<:herramientas:1144616301042602096>')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo2'),
            new ButtonBuilder()
              .setEmoji("<:verificadonaranja:1144615882807591085>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo3"),
            new ButtonBuilder()
              .setEmoji("⚙️")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo5"),
            new ButtonBuilder()
              .setEmoji("🎫")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo6")
          ),
        ButtonNo5: new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setEmoji('🌎')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ButtonNo1'),
          new ButtonBuilder()
            .setEmoji('<:herramientas:1144616301042602096>')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ButtonNo2'),
          new ButtonBuilder()
            .setEmoji("<:verificadonaranja:1144615882807591085>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo3"),
          new ButtonBuilder()
            .setEmoji("<:creador:1144616240371990689>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo4"),
          new ButtonBuilder()
            .setEmoji("🎫")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ButtonNo6")
        ),
        ButtonNo6: new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji('🌎')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo1'),
            new ButtonBuilder()
              .setEmoji('<:herramientas:1144616301042602096>')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('ButtonNo2'),
            new ButtonBuilder()
              .setEmoji("<:verificadonaranja:1144615882807591085>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo3"),
            new ButtonBuilder()
              .setEmoji("<:creador:1144616240371990689>")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo4"),
            new ButtonBuilder()
              .setEmoji("⚙️")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ButtonNo5")
          ),
      };

      const filter = (buttonMessage) => buttonMessage.clicker.id === interaction.user.id;
      const collector = m.createMessageComponentCollector(filter, { time: 30000 });

      collector.on('collect', async (x) => {
        if (x.member.id !== interaction.user.id) return;
        const { customId } = x;
        await m.edit({ embeds: [buttonEmbedMap[customId]], components: [buttonRowMap[customId]], ephemeral: true });
        await x.deferUpdate();
      });
    }
  },
};

function withAliases(cmd) {
  return `**/${cmd.name}**\n`;
}
