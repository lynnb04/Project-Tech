// server
const express = require("express")
const app = express()

require('dotenv').config()

app.listen(3000)
app.use('/static', express.static('static'))
app.use(express.urlencoded({extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

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

// ATLAS MONGDOB APPLICATIONC ODE
const { MongoClient, Objectid} = require("mongodb");
// Mango configuratie uit .env bestand
const uri = process.env.URI;
// nieuwe MongoDB client
const client= new MongoClient(uri);
const db = client.db(process.env.DB_NAME);
// MongoDB connection
async function connectDB() {
try {
    await client.connect();
    console. log ("Client connected to database");
    } catch (error) {
    console.log(error);
    }
}
connectDB();





// index
app.get('/', function(req, res) {
    res.render('pages/index');
  });

  constexpress = require('express')
    constapp = express()
     
    app.use(express.urlencoded({extended:true}))
    
    function showAddForm(req,res) {
      res.render('add.ejs')
    }
     
    function addMovie(req,res) {
      res.send(`Thanksforaddingthemovie with:
    title: ${req.body.title},
    plot: ${req.body.plot},
    and description: ${req.body.description}
      `)
    }

// Add this after your existing routes
app.post('/form', async (req, res) => {
    try {
        const { naam } = req.body;
        const newUser = {
            name: naam,
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        
        console.log('User added successfully:', result);
        res.redirect('/'); 
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user to database');
    }
});

// detail pagina

// Deze code pas ik aan
// app.get('/detail', function(req, res) {
// res.render('pages/detail');

// async function haalDataOp(url){
//     const responce = await fetch(url);
//     const data = await responce.json();
//     console.log(data)
//     toonData(data)
//   }
  
//   haalDataOp('https://app.ticketmaster.com/discovery/v2/events.json?apikey=APwvyNUXVP01u1TvB1FSzRO5ItJrnXA9')
  
//   const ulElement = document.querySelector("ul");
  
//   async function toonData(data){  
//     data._embedded.events.forEach(event => {
//       const liElement = document.createElement("li");
//       liElement.textContent = event.name;
//       ulElement.appendChild(liElement)

//     })
//   }
// });

app.get('/detail', async function(req, res) {
    const url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=APwvyNUXVP01u1TvB1FSzRO5ItJrnXA9';
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const events = data._embedded?.events || [];
      res.render('pages/detail', { events });
    } catch (error) {
      console.error("Fout bij ophalen data:", error);
      res.render('pages/detail', { events: [] });
    }
  });

  
// matching pagina
app.get('/matching', function(req, res) {
    res.render('pages/matching');
});

// overview
app.get('/overview', function(req, res) {
    res.render('pages/overview');
});

// profile
app.get('/profile', function(req, res) {
    res.render('pages/profile');
});

// profile settings
app.get('/profile-settings', function(req, res) {
    res.render('pages/profileSettings');
});