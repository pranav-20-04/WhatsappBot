class Command {

    constructor() {}

    get selfCommand() {
        return false
    }

    get accessors() {
        return []
    }

    async onReady(client) {
        return null
    }

    async execute(client, message) {
        return null
    }
}

module.exports = Command
