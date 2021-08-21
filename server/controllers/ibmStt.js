import fs from 'fs';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1.js';
import  {IamAuthenticator}  from 'ibm-watson/auth/index.js';
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'ExjIkyR57JUHPndaEOUPzSr2DWLq9gz6sktrfc3QnuqJ',
    }),
    serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/bc1ca6c5-02e6-474f-82b6-b31b11299578',
    disableSslVerification: true,
});

export default {
    speechToText: async (req, res) => {
      try {
        const recognizeParams = {
            audio: fs.createReadStream(req.file.path),
            contentType: req.file.mimetype,
            model:'fr-FR_BroadbandModel',
            wordAlternativesThreshold: 0.9,
            keywords: ['bonjour'],
            keywordsThreshold: 0.5,
          };
        
          speechToText.recognize(recognizeParams)
    .then(speechRecognitionResults => {
      console.log(JSON.stringify(speechRecognitionResults, null, 2));
      res.status(200).json({ success: true, speech:speechRecognitionResults.result.results[0].alternatives[0].transcript });
    })
    .catch(err => {
      console.log('error:', err);
    });
    //    res.send(req.file)
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    }
}