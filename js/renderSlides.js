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

let oldChartReference;

function renderSlides(slides) {

    //slide.title slide.config
    slides.forEach(slide => {

        //Create the slide
        const newSlide = document.createElement("div")
        newSlide.className = "slide"
        document.getElementsByClassName("slidesContainer")[0].appendChild(newSlide)

        //Create the list container
        const newListContainer = document.createElement("div")
        newListContainer.className = "listContainer"
        newSlide.appendChild(newListContainer)

        //Create the list
        const newList = document.createElement("ol")
        newList.className = "list"
        newListContainer.appendChild(newList)

        //Create the canvas container
        const newCanvasContainer = document.createElement("div")
        newCanvasContainer.className = "canvasContainer"
        newSlide.appendChild(newCanvasContainer)

        if (slide.title === "search") { //Message search slides 

            //Create the search form
            const messages = slide.messages
            const newSearchForm = document.createElement("form")
            newSearchForm.className = "wordSearch"
            newList.appendChild(newSearchForm)
            const newCanvas = document.createElement("canvas")
            newCanvasContainer.appendChild(newCanvas)

            newSearchForm.innerHTML = `
            <div class="searchBox">
                <input type="text" placeholder="Pesquisar..." class="searchTerm"></input>
                <input type="submit" class="searchSubmit">
                <div class="searchSend"><i class="zmdi zmdi-search"></i></div>
            </div>
            `

            newSearchForm.children[0].children[2].addEventListener("click", event => {
                newSearchForm.children[0].children[1].click()
            })

            newSearchForm.addEventListener("submit", event => {

                event.preventDefault()

                //Ignore empty queries
                if (!event.target[0].value) return

                //Destroy the old chart and list if it isn't the first search
                if (oldChartReference) {
                    oldChartReference.destroy()
                    document.querySelectorAll('.searchListElement').forEach(e => e.remove());
                }

                const searchTerm = event.target[0].value
                const messagesPerAuthor = {}

                messages.forEach(message => {
                    if (!message.content.includes(searchTerm)) return

                    if (!messagesPerAuthor[message.author]) {
                        messagesPerAuthor[message.author] = 1
                    } else {
                        messagesPerAuthor[message.author] += 1
                    }
                })

                const sortedDataArray = Object.entries(messagesPerAuthor).sort((a, b) => b[1] - a[1])
                const chartLabels = sortedDataArray.map(v => v[0])
                const chartValues = sortedDataArray.map(v => v[1])

                const chartConfig = {
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
                                stretch: 5,
                                lineWidth: 0,
                                font: {
                                    minSize: 12
                                }
                            }
                        },
                    }
                }

                // Group everyone not in the top 8 as "outros"
                ndata = chartConfig.data.datasets[0].data.slice()
                const totalSum = ndata.reduce((acc, curr) => acc + curr, 0)
                const top8Sum = ndata.slice(0,8).reduce((acc, curr) => acc + curr, 0) 
                const other = ["Outros", totalSum - top8Sum]

                if (other[1] > 0) {
                    chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.slice(0,8)
                    chartConfig.data.labels = chartConfig.data.labels.slice(0,8)
                    chartConfig.data.datasets[0].data.push(other[1])
                    chartConfig.data.labels.push(other[0])
                }

                const chart = new Chart(newCanvas, chartConfig)

                //Create list items
                const docFrag = document.createDocumentFragment()
                sortedDataArray.forEach(stat => {
                    const listItem = document.createElement("li")
                    listItem.className = "listElement searchListElement"
                    listItem.innerHTML = `<span class="listName">${stat[0]}</span>: ${stat[1]}`
                    docFrag.appendChild(listItem)
                })
                newList.appendChild(docFrag)

                //Keep a reference to the old chart for deletion in subsequent searches
                oldChartReference = chart
            })

        } else { //CPM and Message charts

            //Create the list elements
            const newListElements = slide.config.data.labels.map((author, index) => {
                return `<li class="listElement"><span class="listName">${author}</span>: ${Math.trunc(slide.config.data.datasets[0].data[index])}</li>`
            }).join("")

            //Append the elements to the list
            newList.innerHTML = `
            <div class="listTitle">${slide.title}</div>
            ${newListElements}
            `

            //Create the canvas
            const newCanvas = document.createElement("canvas")
            newCanvasContainer.appendChild(newCanvas)

            const chartConfig = slide.config

            if (chartConfig.type === "bar") {

                //Only show top 8 on chart
                chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.slice(0, 7)
                chartConfig.data.labels = chartConfig.data.labels.slice(0, 7)
            }

            if (chartConfig.type === "outlabeledPie") {

                //Only show the top 8 and group the rest as Others
                ndata = chartConfig.data.datasets[0].data.slice()
                const totalSum = ndata.reduce((acc, curr) => acc + curr, 0)
                const top8Sum = ndata.slice(0, 8).reduce((acc, curr) => acc + curr, 0)
                const other = ["Outros", totalSum - top8Sum]
                if (other[1] > 0) {
                    chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.slice(0,8)
                    chartConfig.data.labels = chartConfig.data.labels.slice(0,8)
                    chartConfig.data.datasets[0].data.push(other[1])
                    chartConfig.data.labels.push(other[0])
                }

            }

            const chart = new Chart(newCanvas, chartConfig)

        }

    });

    document.getElementsByClassName('filename')[0].innerHTML = "Análise concluída"
}