console.log("hello Thomas");
const express = require("express")
const app = express()

app.listen(3000)
app.use('/static', express.static('static'))
app.use(express.urlencoded({extended: true}));

app
    .set('view engine', 'ejs')
    .set('views','view')

const session = require('express-session')
app.use(session({
    //Sla de sessie niet opnieuw op als deze onveranderd is
    resave: false,
    // Sla elke nieuwe sessie in het geheugen op, ook als deze niet gewijzigd is 
    saveUninitialized: true,
    // secret key for session encryption 
    secret: process.env.SESSION_SECRET
}))


