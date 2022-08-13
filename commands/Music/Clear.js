const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "clear",
        description: "Clear Queue",
        usage: "clear",
        aliases: ["cq"],
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.clearQueue();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Queue has been cleared!")
                    .setColor(15007566),
            ],
        });
    },
};
