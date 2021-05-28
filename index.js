const { readdirSync } = require('fs')
const venom = require('venom-bot')
const constants = require("./src/constants")

venom.create().then((client) => {
    onReady(client)
}).catch((err) => {
    console.log(err)
})

// Dynamically load commands from src/commands directory
const commandMapping = {}
const commands = []
readdirSync("./src/commands").forEach((filename) => {
    const basename = filename.substring(0, filename.lastIndexOf('.'))
    const filepath = `./src/commands/${basename}`
    const command  = require(filepath)

    commands.push(command)
    command.accessors.forEach((accessor) => {
        commandMapping[accessor] = command
    })
})


function tokenise(rawCommand) {
    // Dumb tokenisation
    if (rawCommand.startsWith(constants.COMMAND_PREFIX)) {
        return rawCommand.slice(constants.COMMAND_PREFIX.length).split(/ +/)
    } else {
        return null
    }
}

function onReady(client) {

    // Unused as of now
    commands.forEach((cmd) => {
        cmd.onReady(client)
    })

    client.onMessage(async (message) => {

        const args = tokenise(message.body)

        if (args && args.length > 0) {
            const commandName = args[0]
            const command = commandMapping[commandName]

            if (command) {
                try {
                    await command.execute(client, message, args.slice(1, args.length))
                } catch (error) {
                    console.log(error)
                    await client.sendText(message.from, `Something went wrong with the command ${commandName} please try again`)
                    return
                }
            }
        }
    })
}
