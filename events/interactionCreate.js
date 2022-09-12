const path = require('node:path')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isChatInputCommand()) return;

        
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) return;
        
        try {
            await command.execute(interaction);
        } catch (error) {
            if (error.publicMessage) {
                if (!interaction.deferred) {
                    await interaction.reply({ content: error.publicMessage, ephemeral: true });
                } else {
                    await interaction.editReply({ content: error.publicMessage, ephemeral: true });
                }
                console.log(error)

            } else {
                if (!interaction.deferred) {
                    await interaction.reply({ content: 'Something went wrong - please contact user (ŦħȺŧ ǤᵾɎ)#0840 and provide the timestamp of this message', ephemeral: true });
                } else {
                    await interaction.editReply({ content: 'Something went wrong - please contact user (ŦħȺŧ ǤᵾɎ)#0840 and provide the timestamp of this message', ephemeral: true });
                }
                console.log(error)

                
            } 
        }
    }
}

