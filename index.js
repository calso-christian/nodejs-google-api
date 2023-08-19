const express = require('express');
const {google} = require('googleapis');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/messages', async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",

    });


    const client = await auth.getClient();

    const spreadsheetId = "1njX-JkjwZY44f-pXH0a-N9vUN9wT8OuvtRbf9zFysw8";

    const gsheets = google.sheets({version: 'v4', auth: client});

    const data = await gsheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    const getRows = await gsheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Form Responses 1",
    });

    const bday_res = {
        timestamp: [],
        name: [],
        message: [],
    };
    
    const rows = getRows.data.values;
    
    for (const row of rows) {
        bday_res.timestamp.push(row[0]);
        bday_res.name.push(row[1]);
        bday_res.message.push(row[2]);
    }
    console.log(bday_res);
    //res.send(bday_res);
    res.render('index', {bday_res});
});



app.listen(8888, (req, res) => {
    console.log("Running on PORT: 8888");
});