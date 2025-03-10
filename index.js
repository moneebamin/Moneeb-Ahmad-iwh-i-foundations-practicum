require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "process.env.HUBSPOT_ACCESS_TOKEN";
console.log(PRIVATE_APP_ACCESS);
// Route 1: Display driver List
app.get('/', async (req, res) => {
    try {
        const properties = 'driver_name,email,driver_licence';
        const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/2-41751557?properties=${properties}`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Fetched data from HubSpot:", JSON.stringify(response.data, null, 2));
        res.render('homepage', { books: response.data.results });
        
    } catch (error) {
        console.error("Error fetching Driver list:", error);
        res.status(500).send('Error fetching Driver list');
    }
});

// Route 2: Show Form to Add/Edit
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add/Edit Driver Name' });
});


app.post('/update-cobj', async (req, res) => {
    const { driver_name,email,driver_licence } = req.body;
    try {
        await axios.post(`https://api.hubapi.com/crm/v3/objects/2-41751557`, {
            properties: {
                driver_name,
                email,
                driver_licence
            }
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add/update Driver List');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
