const { EmbedBuilder, ButtonStyle } = require("discord.js");
const Pagination = require("customizable-discordjs-pagination");

module.exports = {
    config: {
        name: "queue",
        description: "Displays the queue",
        usage: "queue",
        aliases: ["q"],
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        let chunkedSongs = chunkArray(guildQueue.songs, 10);
        let embeds = [];

        chunkedSongs.forEach((chunk) => {
            let songs = chunk.map((song, index) => {
                return `${guildQueue.songs.indexOf(song) + 1}) [${song.name}](${
                    song.url
                }) \n`;
            });

            embeds.push(
                new EmbedBuilder()
                    .setTitle("Queue")
                    .setColor(15007566)
                    .setDescription(songs.join(""))
            );
        });

        const buttons = [
            {
                label: "Previous",
                style: ButtonStyle.Secondary,
            },
            {
                label: "Next",
                style: ButtonStyle.Primary,
            },
        ];

        Pagination(message, embeds, {
            buttons: buttons,
            paginationCollector: { timeout: 120000 },
            selectMenu: { enable: true },
        });
        return;
    },
};

function chunkArray(arr, chunkCount) {
    return Array.from(new Array(Math.ceil(arr.length / chunkCount)), (_, i) =>
        arr.slice(i * chunkCount, i * chunkCount + chunkCount)
    );
}
