const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "stop",
        description: "Stops the queue",
        usage: "stop",
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.stop();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Song skipped to")
                    .setDescription(`[${nextSong.name}](${nextSong.url})`)
                    .setColor("Blue"),
            ],
        });
    },
};
