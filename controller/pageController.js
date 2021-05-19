const User = require('../models/User');
const Post = require('../models/Post');
const { post } = require('../routes/auth');



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

    async person(req, res){
        try{
            const {token} = req.body

            User.findOne({token: token}, (err, result) => {
                if(result){
                    let findPerson = {
                        name: result.name,
                        nickname: result.nickname
                    }
                    res.status(200).json(findPerson)
                }
            })
            // res.status(400).json({message: 'error request'})
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'error request'})
        }
    }

    async publications(req, res){
        try{
            const {id} = req.body

            // User.findOne({token: token}, (err, result) => {
            //     if(result){
            //         let findPerson = {
            //             name: result.name,
            //             nickname: result.nickname
            //         }
            //         res.status(200).json(findPerson)
            //     }
            // })
            




            User.
            findOne({nickname: id}).
            populate('posts').
            exec(function (err, story) {
                if (err) return console.log('error');
                console.log(story);
                res.status(200).json(story)
            });




        } catch(e){
            console.log(e)
            res.status(400).json({message: 'error request'})
        }
    }

    async newPost(req, res){
        console.log(req.file)
        console.log(req.body)
        try{

            User.findOne({token: req.body.token}, (err, user)  => {
                if(err){
                    res.status(400).json({message: 'Пользователь не найден'})
                }
                if(user){
                    const post = new Post({imgUrl: req.file.filename, text: req.body.text})
                    post.save((err, result) => {
                        
                        User.updateOne({token: req.body.token}, { $push: { posts: result._id } }, (err, result) => {
                            if(err){
                                return res.status(400).json({message: 'файл сохранен но не добавлен'})
                            }

                            if(result){
                                res.status(200).json(result)
                            }
                        })
                    });
                    
                }
            })
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'error request'})
        }
    }
}














module.exports = new authController()