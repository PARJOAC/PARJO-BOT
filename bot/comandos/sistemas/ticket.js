const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const permissions = require("../../../extras/permisos.js");
const Tickets = require("../../../schemas/tickets.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Configurar el sistema de tickets"),
  category: "systems",
  name: "ticket",
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
          .setLabel("Categoría")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("Categoria"),
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
    const row_categoria = new ActionRowBuilder()
      .addComponents(
        new ChannelSelectMenuBuilder()
          .setPlaceholder('Selecciona una categoría')
          .setCustomId("Categoria_listado")
          .setChannelTypes(ChannelType.GuildCategory)
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
      .setDescription("Haz click en los botones para poder configurar correctamente el sistema de tickets")
      .setColor("Green");
    const canal_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Canal")
      .setDescription("Selecciona el canal que deseas establecer para el mensaje")
      .setColor("Green");
    const rol_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Rol")
      .setDescription("Selecciona el rol que deseas establecer para los tickets")
      .setColor("Green");
    const categoria_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Categoría")
      .setDescription("Selecciona la categoria que deseas establecer para los tickets")
      .setColor("Green");
    const estado_embed = new EmbedBuilder()
      .setTitle("🌎 Menú de Estado")
      .setDescription("Selecciona el estado que deseas establecer para los tickets")
      .setColor("Green");

    const m = await interaction.reply({ embeds: [inicio_embed], components: [row_inicio], ephemeral: true });

    const filter = (buttonMessage) => buttonMessage.clicker.id === interaction.user.id;

    const collector = m.createMessageComponentCollector(filter, { time: 30000 });
    let data = await Tickets.findOne({ Guild: interaction.guild.id });
    collector.on('collect', async (x) => {
      if (x.customId === 'Canal') {
        await m.edit({ embeds: [canal_embed], components: [row_canal, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Rol") {
        await m.edit({ embeds: [rol_embed], components: [row_rol, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Categoria") {
        await m.edit({ embeds: [categoria_embed], components: [row_categoria, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Estado") {
        await m.edit({ embeds: [estado_embed], components: [row_estado, row_atras], ephemeral: true });
        await x.deferUpdate();
      }
      if (x.customId === "Canal_listado") {
        if (!data) {
          data = new Tickets({
            Guild: interaction.guild.id,
            Channel: x.values[0]
          });
          await data.save();
        } else await Tickets.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { Channel: x.values[0] }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el canal al sistema de tickets con éxito.`
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
          data = new Tickets({
            Guild: interaction.guild.id,
            Role: x.values[0]
          });
          await data.save();
        } else await Tickets.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { Role: x.values[0] }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el rol al sistema de tickets con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Categoria_listado") {
        if (!data) {
          data = new Tickets({
            Guild: interaction.guild.id,
            Category: x.values[0]
          });
          await data.save();
        } else await Tickets.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { Category: x.values[0] }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido la categoría al sistema de tickets con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Estado_listado") {
        let estado;
        if (x.values[0] === "a") estado = "a"
        if (x.values[0] === "b") estado = "b"
        if (!data) {
          data = new Tickets({
            Guild: interaction.guild.id,
            State: estado
          });
          await data.save();
        } else await Tickets.findOneAndUpdate(
          { Guild: interaction.guild.id },
          { State: estado }
        );
        await data.save();

        m.edit({
          content: `Se ha establecido el estado al sistema de tickets con éxito.`
        })
        await x.deferUpdate();
      }
      if (x.customId === "Enviar") {
        let data2 = await Tickets.findOne({ Guild: interaction.guild.id });
        if (!data2 || !data2.Category || !data2.Channel || !data2.Role || data2.State !== "a") {
          return m.edit({ content: `Primero debes configurar el sistema de tickets.` })
          await x.deferUpdate();
        } else {
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('Create_Ticket')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Success),
            );

          await client.channels.cache.get(data2.Channel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle(`🎫 **Sistema de Tickets de Soporte** 🎫`)
                .setDescription(`¡Bienvenido al sistema de tickets de soporte! Si tienes alguna pregunta, problema o consulta, estaremos encantados de ayudarte. Solo sigue estos sencillos pasos para crear un ticket y uno de nuestros representantes se pondrá en contacto contigo lo antes posible:\n\n1. 📌 Haz clic en el botón "🎫" que encontrarás a continuación.\n
2. 📝 Describe brevemente tu consulta para que podamos ayudarte de manera eficiente.\n
3. 📥 Un miembro de nuestro equipo de soporte se comunicará contigo aquí mismo en este canal.\n\n¡Gracias por confiar en nosotros para resolver tus inquietudes! Esperamos brindarte una experiencia excepcional.`)
            ],
            components: [row]
          })
          return m.edit({ content: `Se ha enviado el mensaje de tickets con éxito.` })
          await x.deferUpdate();
        }
      }
    })
  },
};