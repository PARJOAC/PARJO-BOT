const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Mutes = require('../../../schemas/mute.js');
const permisos = require("../../../extras/permisos.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutear un usuario del servidor')
        .addUserOption(option => option
            .setName('usuario')
            .setDescription('Escribe el usuario a mutear')
            .setRequired(true))
        .addStringOption(option => option
            .setName('razon')
            .setDescription('Escribe la razón del muteo'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: "mod",
    name: "mute",
    execute: async (interaction, client) => {
        let usuario = interaction.options.getUser("usuario");
        let miembro = await interaction.guild.members.fetch(usuario.id)
        let razon = interaction.options.getString("razon") || "Sin razón.";

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({ embeds: [permisos.manageRolesBot()], ephemeral: true });

        const muteRole = await Mutes.findOne({ Guild: interaction.guild.id }).exec();
        if (!muteRole)
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("El rol de muteado no está configurada, utilice el comando \`--setmuterole\`.")
                    .setColor("Red")
                ], ephemeral: true
            });

        if (!miembro)
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("Menciona a un usuario para silenciar.")
                    .setColor("Red")
                ], ephemeral: true
            });

        if (miembro.roles.cache.has(muteRole.Role))
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("Este miembro ya está silenciado.")
                    .setColor("Red")
                ], ephemeral: true
            });

        miembro.roles.add(muteRole.Role);
        interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle(`${interaction.author.username} (ID ${interaction.user.id})`)
                .setDescription(`⚠️ Muteo: ${miembro.user} (ID ${miembro.id})\n📝 Razón: ${razon}`)
                .setColor("Green")
            ], ephemeral: true
        });
    }
}
