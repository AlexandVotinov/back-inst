const express        = require('express');
const router         = express.Router();
const mongo          = require('mongodb').MongoClient
const mongoose       = require('mongoose');
const controller     = require('../controller/pageController');
const bodyParser     = require('body-parser');
const {check}        = require('express-validator');
const config         = require('../config/db');



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});


router.post('/page', controller.page);

module.exports = router;