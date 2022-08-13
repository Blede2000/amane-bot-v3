const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "pause",
        description: "Pause Queue",
        usage: "pause",
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.setPaused(true);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Queue has been paused!")
                    .setColor(15007566),
            ],
        });
    },
};
