const { google } = require('googleapis')
const keys = require('../keys.json')

const google_token = new google.auth.GoogleAuth({
    keyFile: './keys.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

function writeRows(res, range) {
    google.sheets({
        version: 'v4',
        auth: google_token
    }).spreadsheets.values.append({
        spreadsheetId: keys.google.spreadsheet,
        range: range || keys.google.range,
        valueInputOption: 'USER_ENTERED',
        resource: { values: res }
    }).catch(err => console.log(err)).then(res => console.log(res))
}

module.exports = writeRows