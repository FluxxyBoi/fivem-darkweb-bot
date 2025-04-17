const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignore messages sent by the bot itself
            if (message.author.bot) return;

            // Ignore messages in guilds
            if (message.guild) return;

            // Check if the message is a DM with the bot
            const guild = message.client.guilds.cache.get(config.guild);
            if (!guild) throw new Error('Guild not found.');

            // Fetch the latest member data from the API
            const member = await guild.members.fetch({ user: message.author.id, force: true }).catch(() => null);
            if (!member) return message.reply('You are not a member of the guild.');

            // Determine the user's highest-priority role
            let role = null;
            let author = null;

            if (member.roles.cache.has(config.roles.syndicate)) {
                role = 'syndicate';
                author = config.authors.syndicate;
            } else if (member.roles.cache.has(config.roles.redline)) {
                role = 'redline';
                author = config.authors.redline;
            } else if (member.roles.cache.has(config.roles.blackwaters)) {
                role = 'blackwaters';
                author = config.authors.blackwaters;
            } else {
                return message.reply('You do not have the required role to use this feature.');
            }

            // Handle attachments
            const attachments = message.attachments.map(attachment => attachment.url);

            // Check if the message contains only attachments
            if (!message.content && attachments.length > 0) {
                // Send attachments as a normal message for approval
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('✅ Confirm')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('togglePing')
                        .setLabel('Ping Disabled') // Default state is disabled
                        .setStyle(ButtonStyle.Danger)
                );

                const sentMessage = await message.reply({
                    content: 'Click a button to confirm, cancel, or toggle ping.',
                    files: attachments,
                    components: [row],
                });

                // Create a button interaction collector
                const filter = (interaction) => {
                    return ['confirm', 'cancel', 'togglePing'].includes(interaction.customId) && interaction.user.id === message.author.id;
                };

                let pingEnabled = false; // Default state for ping is disabled
                const collector = sentMessage.createMessageComponentCollector({ filter, time: 20000 });

                collector.on('collect', async (interaction) => {
                    try {
                        if (interaction.customId === 'confirm') {
                            // Send the attachments to the darkweb channel
                            const darkwebChannel = guild.channels.cache.get(config.darkwebchannel);
                            if (!darkwebChannel) throw new Error('Darkweb channel not found.');

                            await darkwebChannel.send({
                                content: pingEnabled ? '@everyone' : null,
                                files: attachments,
                            });
                            await interaction.reply({ content: 'Your message has been sent to the darkweb channel.', ephemeral: true });
                        } else if (interaction.customId === 'cancel') {
                            await interaction.reply({ content: 'Your message has been canceled.', ephemeral: true });
                            collector.stop();
                        } else if (interaction.customId === 'togglePing') {
                            // Toggle the ping state
                            pingEnabled = !pingEnabled;
                            const updatedRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('confirm')
                                    .setLabel('✅ Confirm')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('cancel')
                                    .setLabel('❌ Cancel')
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId('togglePing')
                                    .setLabel(pingEnabled ? 'Ping Enabled' : 'Ping Disabled')
                                    .setStyle(pingEnabled ? ButtonStyle.Success : ButtonStyle.Danger)
                            );

                            await sentMessage.edit({ components: [updatedRow] });
                            await interaction.reply({ content: `Ping has been ${pingEnabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
                        }
                    } catch (error) {
                        console.error('Error handling button interaction:', error);
                        await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
                    }
                });

                collector.on('end', async () => {
                    try {
                        // Disable buttons after the collector ends
                        const disabledRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirm')
                                .setLabel('✅ Confirm')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('cancel')
                                .setLabel('❌ Cancel')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('togglePing')
                                .setLabel(pingEnabled ? 'Ping Enabled' : 'Ping Disabled')
                                .setStyle(pingEnabled ? ButtonStyle.Success : ButtonStyle.Danger)
                                .setDisabled(true)
                        );

                        await sentMessage.edit({ components: [disabledRow] }).catch(console.error);
                    } catch (error) {
                        console.error('Error disabling buttons:', error);
                    }
                });

                return; // Exit early since the message was handled as attachments only
            }

            // Determine the thumbnail
            let thumbnail = null;
            if (guild.iconURL()) {
                thumbnail = guild.iconURL();
            } else if (message.client.user.displayAvatarURL()) {
                thumbnail = message.client.user.displayAvatarURL();
            }

            // Create an embed from the user's message
            const embed = new EmbedBuilder()
                .setTitle(`${author}`)
                .setDescription(message.content)
                .setColor('Blue')
                .setFooter({ text: config.embedFooter }) // Use footer text from config
                .setTimestamp();

            if (thumbnail) {
                embed.setThumbnail(thumbnail); // Set thumbnail if available
            }

            if (attachments.length === 1) {
                embed.setImage(attachments[0]);
            }

            // Create buttons for confirmation and ping toggle
            let pingEnabled = false; // Default state for ping is disabled
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('✅ Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('❌ Cancel')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('togglePing')
                    .setLabel('Ping Disabled') // Default state is disabled
                    .setStyle(ButtonStyle.Danger)
            );

            // Send the embed back to the user with buttons
            const sentMessage = await message.reply({
                content: 'Click a button to confirm, cancel, or toggle ping.',
                embeds: [embed],
                components: [row],
            });

            // Create a button interaction collector
            const filter = (interaction) => {
                return ['confirm', 'cancel', 'togglePing'].includes(interaction.customId) && interaction.user.id === message.author.id;
            };

            const collector = sentMessage.createMessageComponentCollector({ filter, time: 20000 });

            collector.on('collect', async (interaction) => {
                try {
                    if (interaction.customId === 'confirm') {
                        // Send the embed to the darkweb channel
                        const darkwebChannel = guild.channels.cache.get(config.darkwebchannel);
                        if (!darkwebChannel) throw new Error('Darkweb channel not found.');

                        await darkwebChannel.send({
                            content: pingEnabled ? '@everyone' : null,
                            embeds: [embed],
                            files: attachments.length > 1 ? attachments : [],
                        });
                        await interaction.reply({ content: 'Your message has been sent to the darkweb channel.', ephemeral: true });
                    } else if (interaction.customId === 'cancel') {
                        await interaction.reply({ content: 'Your message has been canceled.', ephemeral: true });
                        collector.stop();
                    } else if (interaction.customId === 'togglePing') {
                        // Toggle the ping state
                        pingEnabled = !pingEnabled;
                        const updatedRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirm')
                                .setLabel('✅ Confirm')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('cancel')
                                .setLabel('❌ Cancel')
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('togglePing')
                                .setLabel(pingEnabled ? 'Ping Enabled' : 'Ping Disabled')
                                .setStyle(pingEnabled ? ButtonStyle.Success : ButtonStyle.Danger)
                        );

                        await sentMessage.edit({ components: [updatedRow] });
                        await interaction.reply({ content: `Ping has been ${pingEnabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
                    }
                } catch (error) {
                    console.error('Error handling button interaction:', error);
                    await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
                }
            });

            collector.on('end', async () => {
                try {
                    // Disable buttons after the collector ends
                    const disabledRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setLabel('✅ Confirm')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('cancel')
                            .setLabel('❌ Cancel')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('togglePing')
                            .setLabel(pingEnabled ? 'Ping Enabled' : 'Ping Disabled')
                            .setStyle(pingEnabled ? ButtonStyle.Success : ButtonStyle.Danger)
                            .setDisabled(true)
                    );

                    await sentMessage.edit({ components: [disabledRow] }).catch(console.error);
                } catch (error) {
                    console.error('Error disabling buttons:', error);
                }
            });
        } catch (error) {
            console.error('Error in dmHandler:', error);
            await message.reply('An error occurred while processing your request. Please try again later.');
        }
    },
};