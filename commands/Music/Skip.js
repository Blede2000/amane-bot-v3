const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "skip",
        description: "Skip the current song",
        usage: "skip",
        aliases: ["s"],
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.skip();
        let nextSong = guildQueue.songs[1];

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
