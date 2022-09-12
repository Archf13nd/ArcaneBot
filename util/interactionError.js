module.exports = class interactionError extends Error {
    constructor(message, publicMessage) {
        super (message)
        this.publicMessage = publicMessage
    }

}