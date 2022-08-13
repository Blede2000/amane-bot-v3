const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "now-playing",
        description: "Show now playing song",
        usage: "np",
        aliases: ["np"],
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        let song = guildQueue.nowPlaying;

        if (!song) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("No song is playing right now")
                        .setColor("Red"),
                ],
            });
        }

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(song.name)
                    .setURL(song.url)
                    .setAuthor({ name: song.author })
                    .setColor(15007566)
                    .setDescription(guildQueue.createProgressBar().prettier)
                    .setThumbnail(song.thumbnail),
            ],
        });
    },
};
