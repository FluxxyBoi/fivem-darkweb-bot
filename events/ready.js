const { ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        
        const statuses = config.statuses;

        let index = 0;
        setInterval(() => {
            const status = statuses[index];
            client.user.setActivity({ name: status.name, type: status.type });
            index = (index + 1) % statuses.length;
        }, 15000);
    },
};