const { EmbedBuilder } = require("discord.js");

function createMessage(description) {
  return new EmbedBuilder().setDescription(description).setColor("Red");
}

module.exports = {
  administrator: () => createMessage("No tienes permisos de **ADMINISTRADOR**."),
  botAdministrator: () => createMessage("Necesito permisos de **ADMINISTRADOR**."),
  banUser: () => createMessage("No tienes permisos para **BANEAR MIEMBROS**."),
  banBot: () => createMessage("Necesito permisos para **BANEAR MIEMBROS**."),
  handleReactions: () => createMessage("No tienes permisos para **GESTIONAR MENSAJES**."),
  handleReactionsBot: () => createMessage("Necesito permisos para **GESTIONAR MENSAJES**."),
  manageChannels: () => createMessage("No tienes permisos para **GESTIONAR CANALES**."),
  manageChannelsBot: () => createMessage("Necesito permisos para **GESTIONAR CANALES**."),
  kick: () => createMessage("No tienes permisos para **EXPULSAR MIEMBROS**."),
  kickBot: () => createMessage("Necesito permisos para **EXPULSAR MIEMBROS**."),
  manageRolesBot: () => createMessage("Necesito permisos para **GESTIONAR ROLES**."),
  manageNicknames: () => createMessage("No tienes permisos para **GESTIONAR APODOS**."),
  manageNicknamesBot: () => createMessage("Necesito permisos para **MANEJAR APODOS**."),
  addReactions: () => createMessage("Necesito permisos para **AÑADIR REACCIONES**."),
  muteMembersBot: () => createMessage("Necesito permisos para **MUTEAR MIEMBROS**."),
  muteMembers: () => createMessage("No tienes permisos para **MUTEAR MIEMBROS**."),
};