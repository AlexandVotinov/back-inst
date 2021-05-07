const User               = require('../models/User');
const bcrypt             = require('bcrypt');
const {validationResult} = require('express-validator');


class authController{
    async page(req, res){
        try{
            const {id, token} = req.body
            User.findOne({token: token}, (err, result) => {
                if(result){
                    User.findOne({nickname: id}, (err, person) => {
                        let findPerson = {
                            name: person.name,
                            nickname: person.nickname,
                            main: result.nickname == person.nickname
                        }
                        res.status(200).json(findPerson)
                        
                    })
                }
            })
            // res.status(400).json({message: 'error request'})
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'error request'})
        }
    }
}

module.exports = new authController()