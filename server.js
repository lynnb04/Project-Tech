const express = require("express")
const multer  = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

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
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Footer link actief
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});


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
const { MongoClient } = require("mongodb");
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
// --------------------
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

// app.get('/detail', async function(req, res) {
//     const url = `${process.env.API_URL}?countryCode=NL&segmentName=Music&apikey=${process.env.API_KEY}`;
  
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       const events = data._embedded?.events || [];
//       res.render('pages/detail', { events });
//     } catch (error) {
//       console.error("Fout bij ophalen data:", error);
//       res.render('pages/detail', { events: [] });
//     }
//   });




// matching pagina
// --------------------
app.get('/matching', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;

    // Haal de volledige gebruiker op vanuit de database
    const currentUser = await db.collection('users').findOne({ _id: new ObjectId(currentUserId) });
    if (!currentUser) return res.redirect('/');

    const prefs = currentUser.preferences;

    // Verzamel uitgesloten gebruikers (already swiped/matched)
    const excludedIds = [
      ...(currentUser.pendingMatch || []),
      ...(currentUser.noMatch || []),
      ...(currentUser.match || [])
    ];
    
    const excludedIdStrings = excludedIds.map(item => {
      if (typeof item === 'object' && item !== null && item._id) {
        return item._id.toString();
      }
      return item.toString();
    });

    // Eerste filter: gebruikers die voldoen aan jouw voorkeuren
    const initialQuery = {
      _id: { $ne: new ObjectId(currentUserId) }, // Niet jezelf
      age: { $gte: prefs.minAge, $lte: prefs.maxAge }
    };

    if (prefs.geslacht !== 'nvt') {
      initialQuery.gender = prefs.geslacht;
    }

    if (prefs.taal && prefs.taal.length > 0 && !prefs.taal.includes('nvt')) {
      initialQuery['preferences.taal'] = { $in: prefs.taal };
    }

    if (prefs.genres && prefs.genres.length > 0) {
      initialQuery['preferences.genres'] = { $in: prefs.genres };
    }

    const users = await db.collection('users').find(initialQuery).toArray();

    // Tweede filter: wederzijdse voorkeuren én niet eerder geswipet
    const mutualMatches = users.filter(user => {
      const otherPrefs = user.preferences;

      const matchesTheirAgeRange =
        currentUser.age >= otherPrefs.minAge &&
        currentUser.age <= otherPrefs.maxAge;

      const genderMatches =
        otherPrefs.geslacht === 'nvt' ||
        otherPrefs.geslacht === currentUser.gender;

      const notAlreadyHandled = !excludedIdStrings.includes(user._id.toString());

      return matchesTheirAgeRange && genderMatches && notAlreadyHandled;
    });

    res.render('pages/matching', { users: mutualMatches });

  } catch (err) {
    console.error("Fout bij ophalen wederzijdse matches:", err);
    res.status(500).send("Fout bij het ophalen van matches.");
  }
});
// https://www.mongodb.com/docs/manual/reference/operator/query/gte/
// https://www.mongodb.com/docs/manual/reference/operator/query/ne/

// match toevoegen of afwijzen
// --------------------
// add match
app.post('/match/add/:id', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const targetUserId = req.params.id;
    const eventId = req.body.eventId || null; // ← komt vanuit hidden input in je EJS

    const dbUsers = db.collection('users');

    const currentUser = await dbUsers.findOne({ _id: new ObjectId(currentUserId) });
    const targetUser = await dbUsers.findOne({ _id: new ObjectId(targetUserId) });

    if (!currentUser || !targetUser) return res.redirect('/matching');

    const hasMatchedMe = (targetUser.pendingMatch || []).some(match => {
      if (typeof match === 'object' && match._id) {
        return match._id.toString() === currentUserId &&
               (!eventId || match.eventId === eventId); // match moet bij zelfde event horen
      }
      return match === currentUserId; // voor backward compatibility
    });

    if (hasMatchedMe) {
      // Wederzijdse match!
      await dbUsers.updateOne(
        { _id: new ObjectId(currentUserId) },
        {
          $addToSet: {
            matched: { _id: new ObjectId(targetUserId), ...(eventId && { eventId }) }
          },
          $pull: {
            pendingMatch: { _id: new ObjectId(targetUserId), ...(eventId && { eventId }) }
          }
        }
      );

      await dbUsers.updateOne(
        { _id: new ObjectId(targetUserId) },
        {
          $addToSet: {
            matched: { _id: new ObjectId(currentUserId), ...(eventId && { eventId }) }
          },
          $pull: {
            pendingMatch: { _id: new ObjectId(currentUserId), ...(eventId && { eventId }) }
          }
        }
      );
    } else {
      // Nog geen wederzijdse match, zet in afwachting
      const pendingEntry = { _id: new ObjectId(targetUserId) };
      if (eventId) pendingEntry.eventId = eventId;

      await dbUsers.updateOne(
        { _id: new ObjectId(currentUserId) },
        { $addToSet: { pendingMatch: pendingEntry } }
      );
    }

    // Redirect naar juiste pagina
    res.redirect(eventId ? `/concertMatching/${eventId}` : '/matching');

  } catch (err) {
    console.error("Fout bij toevoegen van match:", err);
    res.status(500).send("Er ging iets mis bij het toevoegen.");
  }
});

// skip match
app.post('/match/skip/:id', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const targetUserId = req.params.id;

    await db.collection('users').updateOne(
      { _id: new ObjectId(currentUserId) },
      { $addToSet: { noMatch: targetUserId } }
    );

    res.redirect('/matching');
  } catch (err) {
    console.error("Fout bij overslaan:", err);
    res.status(500).send("Er ging iets mis bij het overslaan.");
  }
});




// concertMatching
// --------------------
app.get('/concertMatching/:eventId', async (req, res) => {
  const currentUserId = req.session.user?.id;
  const eventId = req.params.eventId;

  if (!currentUserId) {
    return res.status(401).send('Je moet ingelogd zijn.');
  }

  try {
    const currentUser = await db.collection('users').findOne({ _id: new ObjectId(currentUserId) });
    if (!currentUser) return res.redirect('/');

    // Check of gebruiker dit event bezoekt
    if (!currentUser.goingEvents || !currentUser.goingEvents.includes(eventId)) {
      return res.status(403).send('Toegang geweigerd. Je hebt niet aangegeven dat je naar dit event gaat.');
    }

    // Haal eventtitel op via API
    const eventUrl = `${process.env.API_URL_DETAIL}/${eventId}.json?apikey=${process.env.API_KEY}`;
    const response = await fetch(eventUrl);
    if (!response.ok) throw new Error('Event ophalen mislukt');
    const event = await response.json();

    const prefs = currentUser.preferences;

    const excludedIds = [
      ...(currentUser.pendingMatch || []),
      ...(currentUser.noMatch || []),
      ...(currentUser.match || [])
    ];
    
    const excludedIdStrings = excludedIds.map(item => {
      if (typeof item === 'object' && item !== null && item._id) {
        return item._id.toString();
      }
      return item.toString();
    });

    const initialQuery = {
      _id: { $ne: new ObjectId(currentUserId) },
      age: { $gte: prefs.minAge, $lte: prefs.maxAge }
    };

    if (prefs.geslacht !== 'nvt') {
      initialQuery.gender = prefs.geslacht;
    }

    if (prefs.taal && prefs.taal.length > 0 && !prefs.taal.includes('nvt')) {
      initialQuery['preferences.taal'] = { $in: prefs.taal };
    }

    const users = await db.collection('users').find(initialQuery).toArray();

    const mutualMatches = users.filter(user => {
      const otherPrefs = user.preferences;
      const matchesTheirAgeRange =
        currentUser.age >= otherPrefs.minAge &&
        currentUser.age <= otherPrefs.maxAge;

      const genderMatches =
        otherPrefs.geslacht === 'nvt' || otherPrefs.geslacht === currentUser.gender;

      const notAlreadyHandled = !excludedIdStrings.includes(user._id.toString());

      return matchesTheirAgeRange && genderMatches && notAlreadyHandled;
    });

    // Geef event name mee aan de EJS
    res.render('pages/concertMatching', {
      users: mutualMatches,
      eventTitle: event.name,
      eventId
    });

  } catch (err) {
    console.error("Fout bij concert-matching:", err);
    res.status(500).send("Interne serverfout");
  }
});


// overview
// --------------------
app.get('/overview', async function (req, res) {
    // Haal filters uit de query
    const selectedGenres = req.query.genres || [];
    const selectedCities = req.query.cities || [];
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
  
    // API URLs
    const urlEvents = `${process.env.API_URL}?countryCode=NL&segmentName=Music&size=100&apikey=${process.env.API_KEY}`;
    const urlGenres = `${process.env.API_URL_GENRES}?apikey=${process.env.API_KEY}`;
  
    try {
      // Genres ophalen
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
  
      const genres = Array.from(genresSet).sort();
  
      // Evenementen ophalen
      const eventsResponse = await fetch(urlEvents);
      const eventsData = await eventsResponse.json();
      let events = eventsData._embedded?.events || [];
  
      // Filters toepassen
      if (selectedGenres.length || selectedCities.length || dateFrom || dateTo) {
        events = events.filter(event => {
          const genre = event.classifications?.[0]?.genre?.name;
          const city = event._embedded?.venues?.[0]?.city?.name;
          const date = new Date(event.dates.start.localDate); 
          // Genre filter
          if (selectedGenres.length && (!genre || !selectedGenres.includes(genre))) {
            return false;
          } 
          // City filter
          if (selectedCities.length && (!city || !selectedCities.includes(city))) {
            return false;
          }  
          // Date filters
          if (dateFrom && date < new Date(dateFrom)) {
            return false;
          }  
          if (dateTo && date > new Date(dateTo)) {
            return false;
          }  
          return true;
        });
      }
  
      // Unieke steden verzamelen uit de gefilterde events
      const citiesSet = new Set();
      events.forEach(event => {
        const city = event._embedded?.venues?.[0]?.city?.name;
        if (city) citiesSet.add(city);
      });
  
      const cities = Array.from(citiesSet).sort();
  
      res.render('pages/overview', {events, genres, cities, selectedGenres, selectedCities, dateFrom, dateTo});
  
    } catch (error) {
      console.error("Fout bij ophalen data:", error);
      res.render('pages/overview', {events: [], genres: [], cities: [], selectedGenres: [], selectedCities: [], dateFrom: null, dateTo: null});
    }
});

// profile
// --------------------
app.get('/profile', function(req, res) {
    res.render('pages/profile');
});

// profile settings
// --------------------
const fs = require('fs');
 const port = 3000;

// zorgt dat de uploads folder altijd bestaat
 const uploadDir = path.join(__dirname, 'uploads');
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir);
 }

// EJS view engine
 app.set('view engine', 'ejs');

// Middleware om URL-encoded form data te verwerken
 app.use(express.urlencoded({ extended: true }));

 app.use('/uploads', express.static(uploadDir));
 app.use('/public', express.static(path.join(__dirname, 'public')));

// Multer storage configuratie


// In-memory user data (vervang door database)
 let user = {
   username: 'johndoe',
   email: 'john@example.com',
   profilePic: null
 };

// Render profile settings page
 app.get('/profile-settings', (req, res) => {
   res.render('pages/profileSettings', { user });
 });

// formulier uploaden
 app.post('/profile-settings', upload.single('profilePic'), (req, res) => {
   const { username, email } = req.body;
   user.username = username;
   user.email = email;
   if (req.file) {
     user.profilePic = req.file.filename;
   }
  // terug naar profile settings page
   res.redirect('/profile-settings');
 });

 app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
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

// post voor registration
app.post('/registration', upload.single('img'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            bio,
            minAge,
            maxAge,
            geslacht,
            taal,
            genres
        } = req.body;

        // Controlle
        if (!firstName || !email || !password) {
            return res.status(400).send('Vul alle verplichte velden in.');
        }

        const newUser = {
            firstName,
            lastName,
            email,
            password: await hashData(password),
            age: Number(age),
            bio,
            preferences: {
                minAge: Number(minAge),
                maxAge: Number(maxAge),
                geslacht,
                taal,
                genres: Array.isArray(genres) ? genres : [genres]
            },
            imagePath: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date(),
            favorites: [],
            pendingMatch: [],
            noMatch: [],
            match: []
        };

        const result = await db.collection('users').insertOne(newUser);

        console.log('Nieuwe registratie toegevoegd:', result.insertedId);
        res.redirect('/');
    } catch (error) {
        console.error('Fout bij registratie:', error);
        res.status(500).send('Er is iets fout gegaan bij het registreren');
    }
});


// Login
// --------------------

// const session = require("express-session");

// Middleware for session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
    res.redirect("/"); // Redirect to the index page if not authenticated
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
      req.session.user = {
        id: zoekBezoeker._id.toString() // altijd als string opslaan
      };

      return res.redirect("/account"); // Redirect to account page on successful login
    } else {
      return res.render("pages/login", { bericht: "Onjuist wachtwoord." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("pages/login", { bericht: "Er is een fout opgetreden." });
  }
});

// app.get("/account", isLoggedIn, (req, res) => {
//   const user = req.session.user; // Retrieve user info from session
//   res.render("pages/account", { user }); // Pass user data to the view
// });

// app.get("/account", isLoggedIn, (req, res) => {
//     const user = req.session.user;
//     console.log("Gebruiker in sessie:", user);
//     res.render("pages/account", { user });
//   });

app.get("/account", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    console.log('User ID from session:', userId);

    if (!userId || !ObjectId.isValid(userId)) {
      return res.redirect("/");
    }

    const gebruiker = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    console.log('User found:', gebruiker);

    if (!gebruiker) return res.status(404).send("Gebruiker niet gevonden.");

    // Variabelen alvast definiëren
    let matchedUsers = [];
    let favoriteEvents = [];
    let goingEvents = [];

    // Matched users ophalen
    if (Array.isArray(gebruiker.matched) && gebruiker.matched.length > 0) {
      const matchedIds = gebruiker.matched
        .map(item => (item._id ? item._id.toString() : null))
        .filter(id => id && ObjectId.isValid(id))
        .map(id => new ObjectId(id));

      if (matchedIds.length > 0) {
        matchedUsers = await db.collection('users')
          .find({ _id: { $in: matchedIds } })
          .project({ firstName: 1, lastName: 1, imagePath: 1 })
          .toArray();
      }
    }

    // Favoriete events ophalen via API
    if (Array.isArray(gebruiker.favorites) && gebruiker.favorites.length > 0) {
      const eventPromises = gebruiker.favorites.map(eventId => {
        const url = `${process.env.API_URL_DETAIL}/${eventId}.json?apikey=${process.env.API_KEY}`;
        return fetch(url)
          .then(res => (res.ok ? res.json() : null))
          .catch(() => null);
      });
      const results = await Promise.all(eventPromises);
      favoriteEvents = results.filter(event => event !== null);
    }

    // Events waar user naartoe gaat ophalen
    if (Array.isArray(gebruiker.goingEvents) && gebruiker.goingEvents.length > 0) {
      const eventPromises = gebruiker.goingEvents.map(eventId => {
        const url = `${process.env.API_URL_DETAIL}/${eventId}.json?apikey=${process.env.API_KEY}`;
        return fetch(url)
          .then(res => (res.ok ? res.json() : null))
          .catch(() => null);
      });
      const results = await Promise.all(eventPromises);
      goingEvents = results.filter(event => event !== null);
    }

    res.render("pages/account", {
      user: gebruiker,
      matchedUsers,
      favoriteEvents,
      goingEvents
    });

  } catch (error) {
    console.error("Fout bij ophalen gebruiker:", error);
    res.status(500).send("Fout bij ophalen gebruiker");
  }
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

// Footer link actief
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
  });


// like van een event
app.post('/favorites', async (req, res) => {
  const { eventId } = req.body;
  const userId = req.session.user ? req.session.user.id : null;

  if (!userId) return res.status(401).json({ error: 'Niet ingelogd' });
  if (!eventId) return res.status(400).json({ error: 'Geen eventId opgegeven' });

  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: eventId.toString() } } // toegevoegde favorite eventId als string
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Fout bij toevoegen favoriet:', err);
    res.status(500).json({ error: 'Fout bij toevoegen favoriet' });
  }
});

// Favoriet verwijderen
app.delete('/favorites', async (req, res) => {
  const { eventId } = req.body;
  const userId = req.session.user ? req.session.user.id : null;

  if (!userId) return res.status(401).json({ error: 'Niet ingelogd' });
  if (!eventId) return res.status(400).json({ error: 'Geen eventId opgegeven' });

  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: eventId.toString() } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Fout bij verwijderen favoriet:', err);
    res.status(500).json({ error: 'Fout bij verwijderen favoriet' });
  }
});

app.get("/account", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect("/");

    const gebruiker = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!gebruiker) return res.status(404).send("Gebruiker niet gevonden.");

    // -------------------
    // Voeg hier de matchedUsers code toe:
    let matchedUsers = [];
    if (Array.isArray(gebruiker.matched) && gebruiker.matched.length > 0) {
      const matchedIds = gebruiker.matched
        .map(item => item._id ? item._id.toString() : null)
        .filter(id => id && ObjectId.isValid(id))
        .map(id => new ObjectId(id));

      if (matchedIds.length > 0) {
        matchedUsers = await db.collection('users')
          .find({ _id: { $in: matchedIds } })
          .project({ firstName: 1, lastName: 1, imagePath: 1 })
          .toArray();
      }
    }
    // -------------------

    // Later kun je hier ook favoriteEvents en goingEvents ophalen...

    res.render("pages/account", { user: gebruiker, matchedUsers /*, favoriteEvents, goingEvents */ });

  } catch (error) {
    console.error("Fout bij ophalen gebruiker:", error);
    res.status(500).send("Fout bij ophalen gebruiker");
  }
});

app.post('/api/going', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { eventId } = req.body;

    if (!userId) { 
      return res.status(401).json({ message: 'Niet ingelogd' });
    }

    const userCollection = db.collection('users');

    // Voeg het event toe aan het 'goingEvents' veld van de gebruiker
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { goingEvents: eventId } }
    );

    res.status(200).json({ message: 'Event opgeslagen als going' });
  } catch (error) {
    console.error('Fout bij opslaan van going:', error);
    res.status(500).json({ message: 'Serverfout' });
  }
});