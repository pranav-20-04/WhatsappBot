const { default: axios } = require("axios")
const Command = require("../class/Command")

const SEARCH_API_URL = "https://api.wikimedia.org/core/v1/wikipedia/en/search/title"
const EXTRACT_API_URL = "https://en.wikipedia.org/w/api.php"


/**
 * Queries Wikipedia api and sends a summary of top article
 */
class Wikipedia extends Command {

    get accessors() {
        return ["wikipedia", "wiki"]
    }

    async execute(client, message, args) {
        if (args.length < 1) { 
            client.sendText(message.from, "You need to specify what to search")
            return
        }

        const searchQuery = args.join(" ")
        const searchOptions = {
            "q": searchQuery,
            "limit": 1
        }

        try {
            var searchResponse = await axios.get(SEARCH_API_URL, {
                params: searchOptions
            })
        } catch(error) {
            client.sendText(message.from, "something went wrong with the wikipedia API!")
            return
        }
        
        const searchData = searchResponse.data
        const pageId = searchData.pages[0].id

        // Get extract for the wikipedia page
        const extractOptions = {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "pageids": pageId,
            "formatversion": "1",
            "exchars": "1000",
            "exlimit": "20",
            "exintro": 1,
            "explaintext": 1
        }

        try {
            var extractResponse = await axios.get(EXTRACT_API_URL, {
                params: extractOptions
            })
        } catch(error) {
            console.log(error)
            client.sendText(message.from, "Something went wrong with wikipedia api")
            return
        }

        const extractData = extractResponse.data
        const title = searchData.pages[0].title
        const extract = extractData.query.pages[pageId].extract

        const content = `*${title}*\n\n${extract}`
        client.sendText(message.from, content)
    }
}

module.exports = new Wikipedia()
