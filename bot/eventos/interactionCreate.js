const verify = require("../../schemas/verify.js");
const ticket = require("../../schemas/tickets.js");
const Spam = require("../../schemas/spam.js");
const fs = require('fs');
const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require("discord.js");
module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash.get(interaction.commandName);
    if (!command) {
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: 'Algo salió mal al ejecutar el comando...',
        ephemeral: true
      })
    }
  }


  if (interaction.isButton() && interaction.customId == "Bot_verify") {
    const data = await verify.findOne({ Guild: interaction.guild.id });
    if (data) {
      var verifyUser = interaction.guild.members.cache.get(interaction.user.id);
      verifyUser.roles.add(data.Role);
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Has sido verificado exitosamente.")
          .setColor("Green")
        ], ephemeral: true
      })
    }
  }
  if (interaction.isButton() && interaction.customId == "Create_Ticket") {
    const data_ticket = await ticket.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id })
    const openTicket = interaction.guild.channels.cache.find(channel =>
      channel.type === ChannelType.GuildText && channel.name.startsWith("ticket-") && channel.name.endsWith(interaction.member.user.username)
    );
    if (openTicket)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`Ya tienes un ticket abierto: ${openTicket}`)
          .setColor("Red")
        ], ephemeral: true
      });

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.member.user.username}`,
      type: ChannelType.GuildText,
      parent: data_ticket.Category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.member.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: data_ticket.Role,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Close_Ticket')
          .setLabel('Cerrar ❌')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('Transcription')
          .setLabel('Transcripcion 📋')
          .setStyle(ButtonStyle.Secondary)
      );

    await ticketChannel.send({
      content: `${interaction.member.user}`, embeds: [new EmbedBuilder()
        .setDescription(`🎟️ **Ticket de Soporte** 🎟️\n\n¡Hola ${interaction.member.user}! 👋 Gracias por crear un ticket de soporte. Nuestro equipo está aquí para ayudarte con cualquier problema o pregunta que puedas tener. Por favor, proporciona más detalles sobre tu consulta para que podamos asistirte de manera efectiva.\n\nMientras esperas a que uno de nuestros representantes se una a la conversación, asegúrate de haber descrito tu situación con claridad. Cuanta más información nos brindes, más rápido podremos resolver tu problema.\n\nApreciamos tu paciencia y estamos comprometidos en brindarte la mejor asistencia posible. En breve, uno de nuestros agentes se pondrá en contacto contigo aquí mismo.\n\n¡Gracias por ser parte de nuestra comunidad y confiar en nuestro soporte!\n\n*Recuerda que siempre puedes actualizar este ticket con información adicional si es necesario.*`)
        .setColor("Green")],
      components: [row]
    });

    interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription(`Tu ticket es: ${ticketChannel}`)
        .setColor("Green")
      ], ephemeral: true
    });
  }

  if (interaction.isButton() && interaction.customId == "Close_Ticket") {
    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription("El ticket se eliminará en 5 segundos.")
        .setColor("Green")
      ], ephemeral: true
    })
    setTimeout(async () => interaction.channel.delete(), 5000);
  }
  if (interaction.isButton() && interaction.customId == "Transcription") {
    const messages = await interaction.channel.messages.fetch({ limit: 100 });

    let transcript = "";
    messages.forEach(async (msg) => {
      const hora_discord = msg.createdTimestamp;
      const fecha = new Date(hora_discord).toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
      transcript += `[ ENVIADO POR ${msg.author.username} - ${fecha} ] => ${msg.content}\n`;
    });

    fs.writeFile('./extras/transcripcion.txt', transcript, async (err) => {
      if (err) {
        console.error(err);
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription('Ha ocurrido un error al hacer la transcripción.')
            .setColor("Red")
          ], ephemeral: true
        });
      }
      const user = client.users.cache.get(interaction.member.user.id);

      await user.send({
        embeds: [new EmbedBuilder()
          .setDescription(`Aquí tienes la transcripcion del ticket.`)
          .setColor("Green")
        ],
        files: [
          {
            attachment: './extras/transcripcion.txt',
            name: `transcripcion-${interaction.guild.name}.txt`
          }
        ]
      }).then(() => {
        interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription(`La transcripción se ha enviado a ${interaction.member.user} mediante DM.`)
            .setColor("Green")
          ], ephemeral: true
        });
      }).catch(error => {
        interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription('Ha ocurrido un error al enviar la transcripción.')
            .setColor("Red")
          ], ephemeral: true
        });
      });
    });
  }

}