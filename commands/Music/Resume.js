const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "resume",
        description: "Resume Queue",
        usage: "resume",
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.setPaused(false);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Queue has resumed!")
                    .setColor(15007566),
            ],
        });
    },
};
