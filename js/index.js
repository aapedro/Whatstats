//Handle file parsing and analysis
document.getElementsByClassName("uploaderForm")[0].addEventListener("submit", async (event) => {

    event.preventDefault()
    file = event.target[0].files[0]
    fileName = document.getElementsByClassName("filename")[0]

    //In case there are existing charts, clear them
    document.getElementsByClassName("slidesContainer")[0].innerHTML = ""

    //If there's no file, cancel
    if (!file) return

    function readChat() {

        // If it's a .txt file, analyze it
        if (file.type === "text/plain") {
            file.text().then(text => {
                const data = analyzeChat(text)
                renderSlides(data)
            })

            return
        }

        // If it's zipped, unzip it first
        if (file.type === "application/x-zip-compressed") {
            file.arrayBuffer().then(buffer => {
                const zip = new JSZip()

                zip.loadAsync(buffer).then((zip) => {
                    const data = zip.file("_chat.txt").async("text").then(text => {
                        const data = analyzeChat(text)
                        renderSlides(data)
                    })
                }).catch(() => {
                    console.log("theres no \"chat.txt\" file")
                })
            })

            return
        }

    }

    fileName.innerHTML = "Análise em andamento..."

    readChat()
    event.target.reset()
})

//Handle input system
document.getElementsByClassName("clips")[0].addEventListener("click", event => {
    document.getElementsByClassName("uploaderInput")[0].click()
})

document.getElementsByClassName("send")[0].addEventListener("click", event => {
    document.getElementsByClassName("uploaderSubmit")[0].click()
})

document.getElementsByClassName("uploaderInput")[0].addEventListener("change", event => {
    document.getElementsByClassName("filename")[0].innerHTML = event.target.files[0].name
})