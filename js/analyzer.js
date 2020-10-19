// slideConfig = {
//     type: "",
//     data: {
//         datasets, labels
//     },
//     options:
// }

function analyzeChat(chat) {

    const slideData = []

    function makeChartData(messages, authors, formatting) {

        const colors = [
            "#003f5c",
            "#2f4b7c",
            "#665191",
            "#a05195",
            "#d45087",
            "#f95d6a",
            "#ff7c43",
            "#ffa600"
        ]

        //Get the total messages and total characters for each author
        const messagesPerAuthor = {}
        const charactersPerAuthor = {}
        messages.forEach((message) => {
            if (!Object.keys(messagesPerAuthor).includes(message.author)) {
                messagesPerAuthor[message.author] = 1
                charactersPerAuthor[message.author] = message.content.length
            } else {
                messagesPerAuthor[message.author] += 1
                charactersPerAuthor[message.author] += message.content.length
            }
        })

        function makeMessageChartData() {

            //Sort total messages into an array
            const sortedDataArray = Object.entries(messagesPerAuthor).sort((a, b) => b[1] - a[1])

            //Get the values and labels
            const chartLabels = sortedDataArray.map(v => v[0])
            const chartValues = sortedDataArray.map(v => v[1])

            //Make the options
            const slideConfig = {
                title: "Número de mensagens",
                config: {
                    type: "outlabeledPie",
                    data: {
                        datasets: [{
                            data: chartValues,
                            backgroundColor: colors,
                            borderColor: "transparent"
                        }],
                        labels: chartLabels
                    },
                    options: {
                        legend: {
                            position: "bottom",
                            fullWidth: false
                        },
                        tooltips: {
                            enabled: false
                        },
                        plugins: {
                            outlabels: {
                                backgroundColor: null,
                                text: "%p",
                                color: "#505050",
                                stretch: 10,
                                padding: 5,
                                font: {
                                    minSize: 20
                                }
                            }
                        },
                    }
                }
            }

            slideData.push(slideConfig)
        }

        function makeCpmChartData() {

            //Get the average characters per message
            const cpmPerAuthor = {}
            authors.forEach((value) => {
                cpmPerAuthor[value] = Math.trunc(charactersPerAuthor[value] / messagesPerAuthor[value])
            })

            //Sort it
            const sortedDataArray = Object.entries(cpmPerAuthor).sort((a, b) => b[1] - a[1])

            //Get the values and labels
            const chartLabels = sortedDataArray.map(v => v[0])
            const chartValues = sortedDataArray.map(v => v[1])

            const slideConfig = {
                title: "Caracteres por mensagem",
                config: {
                    type: "bar",
                    data: {
                        datasets: [{
                            data: chartValues,
                            backgroundColor: colors
                        }],

                        labels: chartLabels
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        tooltips: {
                            enabled: false
                        }
                    }
                }
            }

            slideData.push(slideConfig)

        }

        function makeWordSearchData() {

            const slideConfig = {
                title: "search",
                messages: messages,
            }

            slideData.push(slideConfig)
        }


        //Some charts aren't doable for android

        if (formatting === "ios") {
            makeMessageChartData()
            makeCpmChartData()
            makeWordSearchData()
        }

        if (formatting === "android") {
            makeMessageChartData()
            makeCpmChartData()
            makeWordSearchData()
        }
    }


    const messages = []
    const authors = []

    if (chat[0] === ('[')) { //IOS formatting

        chat.match(/\[(([012][0-9])|(3[01]))\/([0][1-9]|1[012])\/\d\d\d\d (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d\].*/gm)
            .filter(line => line.startsWith("[") && line.includes(": "))
            .slice(1)
            .forEach((currentMessage) => {

                const messageContent = currentMessage.slice(22).split(": ").pop()
                const messageAuthor = currentMessage.slice(22)
                    .split(": ")
                    .shift()
                    .split(" ")
                    .map((name, index) => index > 0 ? name[0] + "." : name)
                    .join(" ")

                if (!authors.includes(messageAuthor)) authors.push(messageAuthor)
                messages.push({
                    content: messageContent,
                    author: messageAuthor
                })

            })

        makeChartData(messages, authors, "ios")

    } else if (chat[0] === "0" || chat[0] === "1" || chat[0] === "2" || chat[0] === "3") { //Android formatting

        chat.match(/(([012][0-9])|(3[01]))\/([0][1-9]|1[012])\/\d\d\d\d (20|21|22|23|[0-1]\d):[0-5]\d - .*/gm)
            .slice(1)
            .filter(line => (line.startsWith("0") || line.startsWith("1") || line.startsWith("2") || line.startsWith("3")) && line.includes(": "))
            .forEach(currentMessage => {

                const messageContent = currentMessage.slice(19).split(": ").pop()
                const messageAuthor = currentMessage.slice(19)
                    .split(": ")
                    .shift()
                    .split(" ")
                    .map((name, index) => index > 0 ? name[0] + "." : name)
                    .join(" ")

                if (messageAuthor.length > 10) console.log(messageContent, messageAuthor)
                if (!authors.includes(messageAuthor)) authors.push(messageAuthor)
                messages.push({
                    content: messageContent,
                    author: messageAuthor
                })
            })

        makeChartData(messages, authors, "android")

    } else { //Unsupported file



    }

    return slideData
}