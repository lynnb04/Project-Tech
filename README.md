# Concertbuddy profielinstellingen

Dit project bevat het profielinstellingen-gedeelte van de Concertbuddy webapplicatie. Gebruikers kunnen hier hun persoonlijke gegevens aanpassen, voorkeuren instellen voor concertmatches en een profielfoto uploaden.

---

## Functionaliteiten

- Persoonlijke gegevens bewerken: voornaam, achternaam, leeftijd, bio, e-mail
- Profielfoto uploaden met `multer`
- Muziekgenres ophalen via een externe API (op basis van voorkeur)
- Matchvoorkeuren instellen: leeftijdsrange, geslachtsvoorkeur, taal
- Automatische verwerking van aangepaste talen
- Enkel voor ingelogde gebruikers toegankelijk

## Belangrijke Bestanden

Bestand / Map                      | Beschrijving                                      
                                   |
`routes/profile-settings`          | Verwerkt GET en POST van profielinstellingen
`views/pages/profileSettings.ejs`  | HTML-pagina met EJS-template voor profielbeheer
`public/profileSettings.css`       | Styling van de profielpagina
`uploads/`                         | Bevat geüploade profielfoto's
`partials/header/footer`           | Herbruikbare paginaonderdelen (navigatie, footer)

## Installatie instructies

1. Clone de repository
   ```bash
   git clone https://github.com/jouwgebruikersnaam/concertmatch.git
   cd concertmatch

npm install

Maak een .env bestand in de root met de volgende inhoud:
API_URL_GENRES=https://app.ticketmaster.com/discovery/v2/classifications
API_KEY=your_api_key_here
SESSION_SECRET=your_session_secret_here

npm start
De app draait standaard op http://localhost:3000.

## Vereisten
- Node.js
- MongoDB (bijv. lokaal of via Atlas)
- Een geldige API key voor de Ticketmaster API (voor genres)

## Screenshots
![image](https://github.com/user-attachments/assets/6b45875a-19fa-4ef4-a30f-baae53d8cc67)
![image](https://github.com/user-attachments/assets/bf90606e-6232-42b4-85ae-19adcd5765ea)
![image](https://github.com/user-attachments/assets/f820ddf7-b769-4dd9-8d6e-5ed55fc5a266)


## Belangrijke opmerkingen
- De map uploads/ wordt automatisch aangemaakt als deze niet bestaat.
- Het formulier is in eerste instantie vergrendeld; bewerken activeert de velden.
- Aangepaste talen worden ondersteund via een tekstveld als "Anders" wordt geselecteerd.

## Licentie
Dit project is onderdeel van een schoolopdracht en wordt gedeeld voor educatieve doeleinden.
