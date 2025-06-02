const express = require("express")
const multer  = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Create filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const app = express()

require('dotenv').config()

app.listen(3000)
app.use('/static', express.static('static'))
app.use(express.urlencoded({extended: true}));
app.use(express.static('styles'));
app.use(express.static('script'));

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


app.post('/form', upload.single('img'), async (req, res) => {
    try {
        const { firstName, lastName, email, password, age } = req.body;
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            age,
            createdAt: new Date(),
            imagePath: req.file ? `/uploads/${req.file.filename}` : null // Store the complete path with filename
        };
        newUser.password = await hashData(password);
        const result = await db.collection('users').insertOne(newUser);
        
        console.log('User added successfully:', result);
        res.redirect('/'); 
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user to database');
    }
});

app.get('/detail', async function(req, res) {
    const url = `${process.env.API_URL}?countryCode=NL&segmentName=Music&apikey=${process.env.API_KEY}`;
  
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
app.get('/overview', async function (req, res) {
    // API URLs
    const urlEvents = `${process.env.API_URL}?countryCode=NL&segmentName=Music&size=100&apikey=${process.env.API_KEY}`;
    const urlGenres = `${process.env.API_URL_GENRES}?apikey=${process.env.API_KEY}`;
  
    try {
      const genresResponse = await fetch(urlGenres);
      const genresData = await genresResponse.json();
  
      const classifications = genresData._embedded?.classifications || [];
      const genresSet = new Set();
  
      classifications.forEach(classification => {
        const segment = classification.segment;
        if (segment?.name === "Music" && segment._embedded?.genres) {
          segment._embedded.genres.forEach(genre => {
            if (genre.name) genresSet.add(genre.name);
          });
        }
      });
  
      const genres = Array.from(genresSet).sort(); // Sorteer genres alfabetisch
  
      // === Stap 2: Haal evenementen op ===
      const eventsResponse = await fetch(urlEvents);
      const eventsData = await eventsResponse.json();
      const events = eventsData._embedded?.events || [];
  
      // Verzamel unieke steden uit de events
      const citiesSet = new Set();
      events.forEach(event => {
        const city = event._embedded?.venues?.[0]?.city?.name;
        if (city) citiesSet.add(city);
      });
  
      const cities = Array.from(citiesSet).sort(); // Sorteer steden alfabetisch
  
      res.render('pages/overview', { events, genres, cities});
  
    } catch (error) {
      console.error("Fout bij ophalen data:", error);
      res.render('pages/overview', {events: [], genres: [], cities: []});
    }
  });

// profile
app.get('/profile', function(req, res) {
    res.render('pages/profile');
});

// profile settings
app.get('/profile-settings', function(req, res) {
    res.render('pages/profileSettings');
});

// registration
// --------------------
app.get('/registration', async function (req, res) {
    const urlGenres = `${process.env.API_URL_GENRES}?apikey=${process.env.API_KEY}`;
  
    try {
      const response = await fetch(urlGenres);
      const data = await response.json();
  
      // Haal alle classificaties eruit
      const classifications = data._embedded?.classifications || [];
  
      // Verzamel unieke genres onder 'Music'
      const genresSet = new Set();
  
      classifications.forEach(classification => {
        const segment = classification.segment;
        if (segment?.name === "Music" && segment._embedded?.genres) {
          segment._embedded.genres.forEach(genre => {
            if (genre.name) {
              genresSet.add(genre.name);
            }
          });
        }
      });
  
      const genres = Array.from(genresSet).sort();
  
      res.render('pages/registration', { genres });
  
    } catch (error) {
      console.error("Fout bij ophalen data:", error);
      res.render('pages/registration', { genres: [] });
    }
  });




// Login
// --------------------

// const session = require("express-session");

// Middleware for session management
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // Prevent unnecessary session saving
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      // Use secure cookies in production
      httpOnly: true,
      // Prevent client-side JavaScript from accessing cookies
      maxAge: 1000 * 60 * 60 * 2,
      // Session expires after 2 hours
    },
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    next(); // User is logged in, proceed to the next middleware or route handler
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Simulate fetching user from the database
    const zoekBezoeker = await db.collection('users').findOne({email:email});
    
    console.log(zoekBezoeker)// Replace with your DB query function

    if (!zoekBezoeker) {
      return res.render("pages/login", { bericht: "Gebruiker niet gevonden." });
    }

    // Compare passwords (assuming compareData is a password comparison function)
    const match = await compareData(password, zoekBezoeker.password);

    if (match) {
      req.session.isLoggedIn = true; // Set session variable
      req.session.user = { id: zoekBezoeker.id, email: zoekBezoeker.email }; // Store user info in session

      return res.redirect("/account"); // Redirect to account page on successful login
    } else {
      return res.render("pages/login", { bericht: "Onjuist wachtwoord." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("pages/login", { bericht: "Er is een fout opgetreden." });
  }
});

app.get("/account", isLoggedIn, (req, res) => {
  const user = req.session.user; // Retrieve user info from session
  res.render("pages/account", { user }); // Pass user data to the view
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Er is een fout opgetreden bij het uitloggen.");
    }
    res.redirect("/login?logout=true"); // Redirect with a query parameter indicating logout success
  });
});


// Password hashing and salting with bcrypt
async function hashData(data){
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedData = await bcrypt.hash(data, salt)
    return hashedData
  }
  catch(error) {
    console.log("Error hashing password: ", error)
  }
}

// Compare given and stored data
async function compareData(plainTextData, hashedData) {
  try {
      // Compare the plain text data with the hashed data
      const match = await bcrypt.compare(plainTextData, hashedData);
      return match;
  } catch (error) {
      console.error('Error comparing data:', error);
      throw error;
  }
}