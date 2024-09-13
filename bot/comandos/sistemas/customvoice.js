const { ChannelType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permisos = require("../../../extras/permisos.js");
const voiceSchema = require("../../../schemas/voice.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('customvoice')
        .setDescription('Configurar el sistema de voz')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: "systems",
    name: "customvoice",
    execute: async (interaction, client) => {
        interaction.guild.channels.create({
            name: "Canales",
            type: ChannelType.GuildCategory,
        }).then(async (cat) => {
            interaction.guild.channels.create({
                name: "➕ Crear canal",
                type: ChannelType.GuildVoice,
                parent: cat.id,
                permissionOverwrites: [
                    {
                        deny: [PermissionsBitField.Flags.Speak],
                        id: interaction.guild.id
                    },
                ],
            }).then(async (ch) => {
                const data = await voiceSchema.findOne({ Guild: interaction.guild.id })
                if (data) {
                    data.Category = cat.id;
                    data.Channel = ch.id
                    data.ChannelName = "{emoji} {member}"
                    await data.save();
                }
                else {
                    new voiceSchema({
                        Guild: interaction.guild.id,
                        Channel: ch.id,
                        ChannelName: "{emoji} {member}",
                        Category: cat.id
                    }).save();
                }


                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`¡Los canales de voz personalizada se ha configurado correctamente!`)
                        .setColor("Green")
                        .addFields([
                            {
                                name: `📘┆Channel`,
                                value: `${ch} (${ch.name})`
                            }
                        ])
                    ]
                });
            });
        })
    }
}