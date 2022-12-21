const { EmbedBuilder } = require("discord.js");
const Genius = require("genius-lyrics");

module.exports = {
    config: {
        name: "lyrics",
        description: "Show lyrics to the current playing song",
        usage: "lyrics",
        aliases: ["l"],
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

        const Client = new Genius.Client();
        const results = await Client.songs.search(song.name);

        if (results.length == 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "This song does not have any lyrics in Genius"
                        )
                        .setColor("Red"),
                ],
            });
        }

        const lyrics = await results[0].lyrics();

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(song.name)
                    .setURL(song.url)
                    .setAuthor({ name: song.author })
                    .setColor(15007566)
                    .setDescription(lyrics)
                    .setThumbnail(song.thumbnail),
            ],
        });
    },
};
