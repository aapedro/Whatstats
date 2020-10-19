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
            const newSearchForm = document.createElement("form")
            newSearchForm.className = "wordSearch"
            newList.appendChild(newSearchForm)

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
                console.log("click")
                event.preventDefault()
            })

            //Create the search box
            // const newSearchBox = document.createElement("div")
            // newList.appendChild(newSearchBox)
            // console.log(newSearchBox)
            // newSearchBox.className = "searchBox"
            // newSearchBox.innerHTML = `
            //     <input type="text" placeholder="Pesquisar..." class="searchTerm"></input>
            //     <div class="searchSend"><i class="zmdi zmdi-search"></i></div>
            // `
            //TODO add logic

        } else { //CPM and Message charts

            //Create the list elements
            const newListElements = slide.config.data.labels.map((author, index) => {
                return `<li class="listElement">${author}: ${Math.trunc(slide.config.data.datasets[0].data[index])}</li>`
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
                chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.slice(0,7)
                chartConfig.data.labels = chartConfig.data.labels.slice(0,7)
            }

            if (chartConfig.type === "outlabeledPie") {

                //Only show users with >5% participation on chart
                ndata = chartConfig.data.datasets[0].data
                const sum = ndata.reduce((acc, curr) => acc + curr, 0)
                let cutoffIndex;
                for (let i = 0; i < ndata.length; i++) {
                    if (ndata[i] * 20 <= sum) {
                        cutoffIndex = i
                        break
                    }
                }
                chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.slice(0, cutoffIndex)
                chartConfig.data.labels = chartConfig.data.labels.slice(0, cutoffIndex)
            }

            const chart = new Chart(newCanvas, chartConfig)

        }

    });
}

//Handle chart rendering and generation
// function renderSlides(slides) {

//     //Checks if there's an existing wordsearch chart
//     let oldSearchChart = false

//     //slide -> title, type, chartparams
//     slides.forEach((slide) => {

//         //Create the slide
//         const newSlide = document.createElement("div")
//         newSlide.className = `slide${slide.type === "search" ? " searchSlide" : ""}`

//         //Create the list container
//         const newListContainer = document.createElement("div")
//         newListContainer.className = "listContainer"

//         if (slide.type !== "search") {

//             //Create the list
//             const newList = slide.chartParams.labels.map((author, index) => {
//                 return `<li class="listElement">${author}: ${Math.trunc(slide.chartParams.datasets[0].data[index])}</li>`
//             }).join("\n")

//             newListContainer.innerHTML = `
//             <ol class="list">
//                 <div class="listTitle">${slide.title}</div>
//                 ${newList}
//             </ol>`
//         }


//         //Create the canvas container
//         const newCanvasContainer = document.createElement("div")
//         newCanvasContainer.className = `canvasContainer ${slide.type === "search" ? "searchCanvasContainer" : ""}`

//         //Create the canvas
//         const newCanvas = document.createElement("canvas")
//         newCanvas.className = "chartCanvas"

//         if (slide.type !== "search") {
//             //Append the chart to the canvas
//             const newChart = new Chart(newCanvas, {
//                 type: slide.type,
//                 data: slide.chartParams,
//                 options: slide.options
//             })

//             //Only show 8 members on bar chart
//             if (slide.type === "bar") {
                // const ndata = newChart.data.datasets[0].data
                // newChart.data.datasets[0].data = ndata.length > 8 ? newChart.data.datasets[0].data.slice(7) : ndata
                // newChart.data.labels = ndata.length > 8 ? newChart.data.labels.slice(7) : newChart.data.labels
//             }

//             //Only display members with over 5% on pie chart
//             if (slide.type === "outlabeledPie") {
//                 const ndata = newChart.data.datasets[0].data
//                 const sum = ndata.reduce((acc, curr) => acc + curr, 0)
//                 let cutoffIndex = 0
//                 for (let i = 0; i < ndata.length; i++) {
//                     if (ndata[i] * 20 < sum) {
//                         cutoffIndex = i
//                         break
//                     }
//                 }
//                 newChart.data.datasets[0].data = newChart.data.datasets[0].data.slice(0, cutoffIndex)
//                 newChart.data.labels = newChart.data.labels.slice(0, cutoffIndex)
//             }
//         }



//         newCanvasContainer.appendChild(newCanvas)
//         newSlide.appendChild(newListContainer)
//         newSlide.appendChild(newCanvasContainer)
//         document.getElementByClassName(".slidesContainer").appendChild(newSlide)

//         if (slide.type === "search") {

//             //Initialize new list
//             const newList = document.createElement("ol")
//             newList.className = "searchList"

//             //Create form
//             const newListSearch = document.createElement("form")
//             newListSearch.className = "wordSearch listTitle" 
//             newListSearch.innerHTML = `
            // <input type="text" class="searchInput">
            // <input type="submit" class="searchSubmit">
//             `

//             newList.appendChild(newListSearch)
//             newListContainer.appendChild(newList)

//             document.getElementByClassName(".wordSearch").addEventListener("submit", (event) => {

//                 event.preventDefault()

                
//                 //Remove previous search DOM elements
//                 if (document.getElementByClassName(".warning")) {
//                     document.getElementByClassName(".warning").remove()
//                 }
//                 //And old chart if there is one
//                 if (oldSearchChart) {
//                     document.getElementByClassNameAll(".searchListElement").forEach(element => element.remove())
//                     oldSearchChart.destroy()
//                     document.getElementByClassName(".searchCanvasContainer").childNodes.forEach(element => element.remove())
//                 }

//                 const rankings = {}
//                 const searchObject = event.target[0].value

//                 slide.messages.forEach((message) => {
//                     if (message.content.includes(searchObject)) {
//                         if (!Object.keys(rankings).includes(message.author)) {
//                             rankings[message.author] = 1
//                         } else {
//                             rankings[message.author] += 1
//                         }
//                     }
//                 })

//                 if (Object.keys(rankings).length < 1) {
//                     newCanvasContainer.innerHTML = `
//                     <div class="warning">
//                         Nenhuma instância da palava ${searchObject} foi encontrada
//                     </div>`
//                     return
//                 }

//                 //Sorting the rankings
//                 const sortedRankings = Object.entries(rankings).sort((a, b) => b[1] - a[1])

//                 //Add items to the list
//                 const itemArray = sortedRankings.map((a) => {
//                     return `${a[0]}: ${a[1]}`
//                 })

//                 itemArray.forEach((element) => {
//                     const newItem = document.createElement("li")
//                     newItem.className = "searchListElement"
//                     newItem.innerHTML = element
//                     newList.appendChild(newItem)
//                 })

//                 //Cut off smaller sections for the chart
//                 const ndata = sortedRankings.map(a => a[1])
//                 const sum = ndata.reduce((acc, curr) => acc + curr, 0)

//                     //Do not make a canvas if the sample size is too small
//                 if (sum < 100) {
//                     newCanvasContainer.innerHTML = `
//                     <div class="warning">
//                         A amostra é pequena demais para um gráfico
//                     </div>`
//                     return
//                 }

//                 let cutoffIndex = 0
//                 for (let i = 0; i < ndata.length; i++) {
//                     if (ndata[i] * 20 < sum) {
//                         cutoffIndex = i
//                         break
//                     }
//                 }
//                 const newChartData = sortedRankings.map(a => a[1]).slice(0, cutoffIndex)
//                 const newChartLabels = sortedRankings.map(a => a[0]).slice(0, cutoffIndex)

//                 //Append the chart to the canvas
//                 const newChart = new Chart(newCanvas, {
//                     type: "outlabeledPie",
//                     data: {
//                         datasets: [{
//                             data: newChartData,
//                             backgroundColor: [
//                                 "#003f5c",
//                                 "#2f4b7c",
//                                 "#665191",
//                                 "#a05195",
//                                 "#d45087",
//                                 "#f95d6a",
//                                 "#ff7c43",
//                                 "#ffa600"
//                             ]
//                         }],

//                         labels: newChartLabels
//                     },
//                     options: {
//                         legend: {
//                             position: "bottom",
//                             fullWidth: false
//                         },
//                         tooltips: {
//                             enabled: false
//                         },
//                         plugins: {
//                             outlabels: {
//                                 backgroundColor: null,
//                                 text: "%p",
//                                 color: "#505050",
//                                 stretch: 10,
//                                 padding: 5,
//                                 font: {
//                                     minSize: 30
//                                 }
//                             }
//                         },
//                     },
//                 })

//                 console.log(newChart)
                
//                 //Create a reference to old chart to delete it on subsequent searches
//                 oldSearchChart = newChart
//             })
//         }

//     })
// }