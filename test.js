const express = require('express');
const cors = require('cors');
const multer  = require('multer');
const upload = multer();
const app = express();
var request = require('request');
var fs = require('fs');
const {saveEmailToFile} = require('./saveEmail')

app.use(express.json())
app.use(cors());
app.listen('8000', () => {
      console.log('app listening on port 8000');
    });

app.get('/token', async (req, res) => {

    request(options_auth, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response.body);
        // Parse the JSON data
          const parsedData = JSON.parse(response.body);
          // Assign the ticket value to a variable
          const ticketValue = parsedData.ticket;
      // Print the ticket value
          console.log(ticketValue);
          res.status(200).json(ticketValue)
      });
});


app.post('/emailPost', upload.single('file'), (req, res) => {
    const ticketValue = req.body.ticketValue;
    //const endpointUrl = 'http://xecm-dev-aio01.dsg.internal/OTCS/cs.exe/api/v2/nodes';
    console.log(req.body.ticketValue);
    console.log(req.body.type);
    console.log(req.body.parent_id);
    console.log(req.body.name);

      var options = {
        'method': 'POST',
        'url': 'http://xecm-dev-aio01.dsg.internal/OTCS/cs.exe/api/v2/nodes',
        'headers': {
          'OTCSTicket': `${ticketValue}` // Assign ticketValue here
        },
        formData: {
            'type': req.body.type,
            'parent_id': req.body.parent_id,
            'name': req.body.name,
            'file': {
              'value': req.file,
              'options': {
                'filename': `${req.body.name}.eml`,
                'contentType': null
              }
            }
          }
      };
      try{
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
          });
        res.status(200).json("")
      }
      catch(error){
        throw new Error(error)
      }
      
 
});

app.post('/saveEmail', async (req, res)=>{
  try {
    // console.log(req.body)
    const { emailContent,emailName } = req.body;
    if (!emailContent) {
      return res.status(400).json({ error: 'No email content provided' });
    }
    
    const filename = await saveEmailToFile(emailContent,emailName);
    
    res.status(200).json({ message: 'Email saved successfully', filename });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ error: error.message });
  }
})

var options_auth = {
  'method': 'POST',
  'url': 'http://xecm-dev-aio01.dsg.internal/OTCS/cs.exe/api/v1/auth',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    'username': 'admin',
    'password': 'P@ssw0rd'
  }
};
    