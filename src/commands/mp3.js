const youtubedl = require("youtube-dl-exec")
const Command = require("../class/Command")


/**
 * Downloads an MP3 file from given youtube link
 */
class Mp3 extends Command {

    get accessors() {
        return ["mp3"]
    }

    async execute(client, message, args) {
        if (args.length < 1) {
            client.sendText(message.from, "Please provide an youtube link to download mp3")
            return
        }

        const url = args[0]

        await client.reply(
            message.from,
            "Please wait while the mp3 is being downloaded.",
            message.id
        )

        const id = await youtubedl(url, {
            "getId": true
        })

        await youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            output: "./tmp/%(id)s.(ext)s"
        })

        const filepath = `./tmp/${id}.mp3`
        await client.sendVoice(message.from, filepath)
    }
}

module.exports = new Mp3()
