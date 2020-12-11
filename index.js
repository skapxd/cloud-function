var request = require('request');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://allapp-10b26.firebaseio.com"
  });
// 

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( { origin:true } ) );



// Routes
app.post('/hellow-word', (req, res) => {
    return res.status(200).send(req.body );
})

// Create
// Post
app.post('/api/create', (req, res) => {

    (async () => {

        
        
        try
        {   
            console.log('Params');
            console.log(req.params);
            console.log('===========================');
            console.log('req.query')
            console.log(req.query)
            console.log('===========================');
            console.log('req.body')
            console.log(req.body)
            console.log('===========================');


            var urimerchant_orders = {
                'method': 'GET',
                'url': `https://api.mercadopago.com/merchant_orders/${req.query.id}`,
                'headers': {
                  'Authorization': 'Bearer APP_USR-3138455051991516-111503-4d7fb24a27f0c4983e515bb55c104f5a-654694341'
                }
            };
            

            request(urimerchant_orders, (error, response1) => {

                if (error) throw new Error(error);
                
                const merchant_orders = JSON.parse(response1.body);

                console.log('================================');

                console.log('merchant_orders.preference_id')
                console.log(merchant_orders.preference_id);

                console.log('================================');

                console.log('merchant_orders');
                console.log(merchant_orders);

                var uripreferences = {
                    'method': 'GET',
                    // 'url': `https://api.mercadopago.com/checkout/preferences/654694341-d57043fa-7223-48f2-8c4a-ef6586242bd2`,
                    'url': `https://api.mercadopago.com/checkout/preferences/${merchant_orders.preference_id}`,
                    'headers': {
                        'Authorization': 'Bearer APP_USR-3138455051991516-111503-4d7fb24a27f0c4983e515bb55c104f5a-654694341'
                    }
                };

                request(uripreferences, async (error, response2) => {
                    if (error) throw new Error(error);
                    
                    const preferences = JSON.parse(response2.body);
    
                    console.log('================================');
    
                    console.log('preferences.payer.email');
    
                    var email = preferences.payer.email;
    
                    console.log(email);
    
                    console.log('================================');

                    console.log('preferences')
                    console.log(preferences)
    
                    await db.collection('products').doc(email).create({
                        merchant_orders : merchant_orders,
                        preferences: preferences,
                    })
                });
            });

            



            // const email = preferences.payer.email;


            
    
            return res.status(200).send('ok');
            

        } 
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();  
});

// Export the API to FCF
exports.app = functions.https.onRequest(app);
