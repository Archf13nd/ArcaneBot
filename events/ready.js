module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`ArcaneAi is ready. User is ${client.user.tag}`)
    }
}