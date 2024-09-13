const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const permissions = require("../../../extras/permisos.js");
const Verificar = require("../../../schemas/verify.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Configurar el sistema de verificación"),
  category: "systems",
  name: "verify",
  execute: async (interaction, client) => {
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.AddReactions))
      return interaction.reply({ embeds: [permissions.handleReactionsBot()], ephemeral: true });

    const row_inicio = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Canal")
          .setStyle(ButtonStyle.Primary)
          .setCustomId('Canal'),
        new ButtonBuilder()
          .setLabel("Rol")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("Rol"),
        new ButtonBuilder()
          .setLabel("Estado")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("Estado"),
        new ButtonBuilder()
          .setLabel("Enviar")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("Enviar")
      );
    const row_atras = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Atrás")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("Atras")
      );
    const row_canal = new ActionRowBuilder()
      .addComponents(
        new ChannelSelectMenuBuilder()
          .setPlaceholder('Selecciona un canal')
          .setCustomId("Canal_listado")
          .setChannelTypes(ChannelType.GuildText)
          .setMaxValues(1)
      );
    const row_rol = new ActionRowBuilder()
      .addComponents(
        new RoleSelectMenuBuilder()
          .setPlaceholder('Selecciona un rol')
          .setCustomId("Rol_listado")
          .setMaxValues(1)
      );
    const row_estado = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder('Selecciona un estado')
          .setCustomId("Estado_listado")
          .addOptions([{
            label: 'Encendido',
            value: 'a',
          }, {
            label: "Apagado",
            value: "b",
          }])
          .setMaxValues(1)
      );

    const inicio_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Setup")
      .setDescription("Haz click en los botones para poder configurar correctamente el sistema de verificación")
      .setColor("Green");
    const canal_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Canal")
      .setDescription("Selecciona el canal que deseas establecer para el mensaje")
      .setColor("Green");
    const rol_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Rol")
      .setDescription("Selecciona el rol que deseas establecer para la verificación")
      .setColor("Green");
    const estado_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Estado")
      .setDescription("Selecciona el estado que deseas establecer para la verificación")
      .setColor("Green");

    const m = await interaction.reply({ embeds: [inicio_embed], components: [row_inicio], ephemeral: true });

    const filter = (buttonMessage) => buttonMessage.clicker.id === interaction.user.id;

    const collector = m.createMessageComponentCollector(filter, { time: 30000 });
    let data = await Verificar.findOne({ Guild: interaction.guild.id });
    collector.on('collect', async (x) => {
      if (x.customId === 'Canal') {
        await m.edit({ embeds: [canal_embed], components: [row_canal, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Rol") {
        await m.edit({ embeds: [rol_embed], components: [row_rol, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Estado") {
        await m.edit({ embeds: [estado_embed], components: [row_estado, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Canal_listado") {
        if (!data) {
          data = new Verificar({
            Guild: interaction.guild.id,
            Channel: x.values[0]
          });
          await data.save();
        } else await Verificar.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { Channel: x.values[0] }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el canal al sistema de verificación con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Atras") {
        await m.edit({
          content: "",
          embeds: [inicio_embed],
          components: [row_inicio],
          ephemeral: true
        })
        await x.deferUpdate();
      }
      if (x.customId === "Rol_listado") {
        if (!data) {
          data = new Verificar({
            Guild: interaction.guild.id,
            Role: x.values[0]
          });
          await data.save();
        } else await Verificar.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { Role: x.values[0] }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el rol al sistema de verificación con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Estado_listado") {
        let estado;
        if (x.values[0] === "a") estado = "a"
        if (x.values[0] === "b") estado = "b"
        if (!data) {
          data = new Verificar({
            Guild: interaction.guild.id,
            State: estado
          });
          await data.save();
        } else await Verificar.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { State: estado }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el estado al sistema de verificación con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Enviar") {
        let data2 = await Verificar.findOne({ Guild: interaction.guild.id });
        if (!data2 || !data2.Channel || !data2.Role || data2.State !== "a") {
          return m.edit({ content: `Primero debes configurar el sistema de verificación.` })
          await x.deferUpdate();
        } else {
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('Bot_verify')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success),
            );

          client.channels.cache.get(data2.Channel).send({
            embeds: [new EmbedBuilder()
              .setTitle('🔒 Verificación de Cuenta 🔒')
              .setDescription(`¡Hola! 👋🏼 Para garantizar la seguridad de nuestra comunidad, te invitamos a completar el proceso de verificación de cuenta. Solo necesitas seguir estos simples pasos:\n\n📌 Haz clic en el botón ✅ que encontrarás más abajo.\n
🕵️ Sigue las reglas proporcionadas en el canal <#1077681133753466910>.\n
🔄 Una vez completada la verificación, estarás listo para disfrutar de todos los beneficios de nuestra plataforma.\n\n
¡Gracias por ser parte de nuestra comunidad segura! Si tienes alguna pregunta o problema, no dudes en contactar a nuestro equipo de soporte en <#1142094643899670628>. ✉️🛠️\n\n¡Esperamos que disfrutes tu experiencia aquí! 🌟🔐Haz clic en el botón para verificarte.`)
              .setColor("Green")
            ],
            components: [row]
          })
          return m.edit({ content: `Se ha enviado el mensaje de verificación con éxito.` })
          await x.deferUpdate();
        }
      }
    })
  },
};