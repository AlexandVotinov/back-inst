const User               = require('../models/User');
const bcrypt             = require('bcrypt');
const {validationResult} = require('express-validator');


class authController{
    async registration(req, res){
        
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {email, name, nickname, password} = req.body
            const candidateName = await User.findOne({nickname})
            const candidateMail = await User.findOne({email})
            if(candidateName){
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            if(candidateMail){
                return res.status(400).json({message: 'Пользователь с таким EMAIL уже существует'})
            }
            let hashPassword = bcrypt.hashSync(password, 6)
            const person = new User({email, name, nickname, password: hashPassword})
            await person.save()
            return res.json({message: 'Пользователь успешно зарегистрирован'})
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error', e})
        }
    }

    async login(req, res){
        try{
            const {nickname, password} = req.body
            const person = await User.findOne({nickname})
            if(!person){
                return res.status(400).json({message: `Пользователь ${nickname} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, person.password)
            if(!validPassword){
                return res.status(400).json({message: `Введен неверный пароль`})
            }

            let hashToken = bcrypt.hashSync(password, 6)

            User.findOneAndUpdate({ nickname: nickname }, { $set: {tocken: hashToken}}, (err, result) => {
                console.log(result)
                res.status(200).json(result)
            })
            
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async verification(req, res){
        try{
            const {token} = req.body
            const person = await User.findOne({token: token})
            console.log(person)
            if(person){
                return res.status(200).json({message: `ok`});
            }
            res.status(400).json({message: 'Verification error'})
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'Verification error'})
        }
    }
}

module.exports = new authController()