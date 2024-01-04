function sendDataToSheets()
{
    const URL = "https://script.google.com/macros/s/AKfycbwb2wR95X5bnAr8wnYImh1ri5J6KteVqzEUpkWovO_rt6f-z71TFj7xdYZOmbQawmKn/exec"
    const form = document.querySelector("form")

    return (fetch(URL, {
        method: 'POST',
        body: new FormData(form)
    }))
    .then(response => {
        if (response.ok) {
            return Promise.resolve();
        }
        else {
            return Promise.reject(new Error("ERROR: " + response.statusText))
        }
    })
    .catch(error => Promise.reject(new Error("ERROR: " + error.message)))
}