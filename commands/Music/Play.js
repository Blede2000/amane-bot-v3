const { EmbedBuilder, codeBlock } = require("discord.js");

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
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(" ")).catch((err) => {
            console.log(err);
            if (!guildQueue) queue.stop();
        });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`A song is playing? ${song.name}`)
                    .addFields({
                        name: "A song is playing",
                        value: "Yes I think it is",
                    })
                    .setColor("Blue"),
            ],
        });
    },
};
