const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "volume",
        description: "Change the volume",
        usage: "volume [amount]",
    },
    permissions: ["SendMessages"],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!args[0])
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(guildQueue.volume)
                        .setColor(15007566),
                ],
            });

        guildQueue.setVolume(parseInt(args[0]));

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Volume has been set to ${parseInt(args[0])}`)
                    .setColor(15007566),
            ],
        });
    },
};
