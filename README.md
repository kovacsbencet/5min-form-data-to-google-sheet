## How To Send HTML Form Data To Google Sheets
`YouTube tutorial:`

### 1. HTML structure
- [x] Create an HTML form with your desired fields.
- [x] Import CSS and JS files according to your folder structure.
- [x] Add `onsubmit="event.preventDefault(); sendDataToSheets();"` to the HTML form
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style/styles.css">
    <script src="script/script.js"></script>
</head>
<body>
    <section>
        <form onsubmit="event.preventDefault(); sendMessage();">
            <div class="row">
                <div>
                    <label for="name">Name:</label>
                    <input type="text" name="name" id="name">
                </div>
                <div>
                    <label for="business">Business:</label>
                    <input type="text" name="business" id="business">
                </div>
            </div>
            <div class="row">
                <div>
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email">
                </div>
                <div>
                    <label for="phone">Phone:</label>
                    <input type="tel" name="phone" id="phone">
                </div>
            </div>
            <div class="row">
                <div>
                    <label for="service">Choose service:</label>
                    <select name="service" id="service">
                        <option value="Web Development">Web Development</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Copywriting">Copywriting</option>
                    </select>
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
    </section>
</body>
</html>
```

### 2. Add CSS styling
```CSS
/* LAYOUT STYLES */

section
{
    display: flex;
    justify-content: center;
    align-items: center;
}

.row div
{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
}

/* INPUT STYLES */

form
{
    max-width: 500px;
    width: 100%;
}

label
{
    margin-bottom: 3px;
}

input
{
    padding: 5px;
}

select
{
    padding: 5px;
    margin-bottom: 5px;
}

button
{
    padding: 5px;
    width: 100%;
    cursor: pointer;
}

/* RESPONSIVE SETTINGS */

@media only screen and (min-width:400px){
    .row
    {
        display: flex;
        gap: 10px;
    }
}
```

### 3. Set up Google Sheets and add App Script
- [x] Create a new Google Sheet
- [x] Name your Sheet and your Worksheet
- [x] In the App Script change `sheetName` to the Worksheet name
```JS
const sheetName = ''
const scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName(sheetName)

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      return header === 'Date' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
```
### 4. Create JS file
```JS
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
```
