const { EmbedBuilder, codeBlock, ButtonStyle } = require("discord.js");
const Pagination = require("customizable-discordjs-pagination");
const Spotify = require("spotify-url-info");
const fetch = require("isomorphic-unfetch");

module.exports = {
    config: {
        name: "play",
        description: "Play music",
        usage: "play [url]",
        aliases: ["p"],
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        if (!args[0])
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Please provide an url name.")
                        .setColor("Red"),
                ],
            });

        let queue = client.player.createQueue(message.guild.id);
        let guildQueue = client.player.getQueue(message.guild.id);
        await guildQueue.join(message.member.voice.channel);

        if (isPlaylist(args[0])) {
            let playlist = await queue.playlist(args.join("")).catch((_) => {
                console.log(_);
                if (!guildQueue) queue.stop();
            });
            getPlaylistMessage(message, playlist);
            return;
        }

        let song = await queue.play(args.join(" ")).catch((err) => {
            console.log(err);
            message.reply("ERROR: " + err);
            if (!guildQueue) queue.stop();
        });

        return getSongMessage(message, song);
    },
};

function isPlaylist(url) {
    const regexList = {
        YouTubePlaylist:
            /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
        YouTubePlaylistID: /[&?]list=([^&]+)/,
        SpotifyPlaylist:
            /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-)+)(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
        ApplePlaylist: /https?:\/\/music\.apple\.com\/.+?\/.+?\/(.+?)\//,
    };

    return regexList.SpotifyPlaylist.test(url);
    // regexList.YouTubePlaylist.test(url) ||
    // regexList.YouTubePlaylistID.test(url) ||
    // regexList.ApplePlaylist.test(url)
}

function chunkArray(arr, chunkCount) {
    return Array.from(new Array(Math.ceil(arr.length / chunkCount)), (_, i) =>
        arr.slice(i * chunkCount, i * chunkCount + chunkCount)
    );
}

function getSongMessage(message, song) {
    message.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(song.name)
                .setURL(song.url)
                .setAuthor({ name: song.author })
                .setColor(15007566)
                .setDescription(`**Duration** ${song.duration}`)
                .setFooter({
                    text: `Requested by ${message.member.user.username}`,
                    iconURL: message.member.user.avatarURL(),
                })
                .setThumbnail(song.thumbnail),
        ],
    });
}

function getPlaylistMessage(message, playlist) {
    let chunkedPlaylist = chunkArray(playlist.songs, 10);
    let embeds = [];

    chunkedPlaylist.forEach((chunk) => {
        let songs = chunk.map((song, index) => {
            return `${playlist.songs.indexOf(song) + 1}) [${song.name}](${
                song.url
            }) \n`;
        });
        embeds.push(
            new EmbedBuilder()
                .setTitle(playlist.name)
                .setURL(playlist.url)
                .setAuthor({ name: playlist.author })
                .setColor(15007566)
                .setDescription(songs.join(""))
                .setFooter({
                    text: `Requested by ${message.member.user.username}`,
                    iconURL: message.member.user.avatarURL(),
                })
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
}
