const express        = require('express');
const router         = express.Router();
const mongo          = require('mongodb').MongoClient
const mongoose       = require('mongoose');
const controller     = require('../controller/authController');
const bodyParser     = require('body-parser');
const {check}        = require('express-validator');
const config         = require('../config/db');



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



router.post('/registration', [
    check('nickname', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 6 и меньше 20').isLength({min: 6, max: 20}),
],controller.registration);

router.post('/login', controller.login);

router.post('/verification', controller.verification);

module.exports = router;