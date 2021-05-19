const express        = require('express');
const router         = express.Router();
const mongo          = require('mongodb').MongoClient
const mongoose       = require('mongoose');
const controller     = require('../controller/pageController');
const bodyParser     = require('body-parser');
const {check}        = require('express-validator');
const config         = require('../config/db');


const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/posts/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});


router.post('/page', controller.page);
router.post('/person', controller.person);
router.post('/publications', controller.publications);
router.post('/new-post', upload.single('file'), controller.newPost);

module.exports = router;