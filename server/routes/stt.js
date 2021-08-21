import express from 'express';

// const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
// controllers
import ibmSTT from '../controllers/ibmStt.js';


import multer from "multer"
var upload = multer({dest:'uploads/'});
const router = express.Router();

router
  .post('/speechToText',upload.single('speech'), ibmSTT.speechToText)
 

export default router;
