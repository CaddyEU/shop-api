const { db } = require("../db")
const Users = db.users
const Items = db.items
const Reviews = db.reviews
const { getBaseUrl } = require('./helpers');

exports.getAll = async (req,res)=>{
    const users = await Users.findAll({attributes:["id","name"]})
    if (users.length == 0){
        res.send({"message":"No users exist"})
  } else {
    res.send(JSON.stringify(users))
  }
}
exports.createNew = async (req, res) =>{
    let users

    try{
        users = await Users.create(req.body, 
            {
                logging:console.log, 
                fields: ["UserId", "UserName"]
            })
    } catch (error){
        if (error instanceof db.Sequelize.ValidationError){
            res.status(400).send({"error": error.errors.map((item)=> item.message)})        
        }else{
            console.log("UserCreate", error) 
            res.status(500).send({"error": "Somthing went wrong on our side. Sorry :("})          
        }
        return
    }

    if(users===null){
        res.status(400).send({"error": "Invalid input, missing required params"})
        return
    }
    res.status(201)
    .location(`${getBaseUrl(req)}/users/${users.UserId}`)
    .json(users)   
}
exports.getById = async (req, res) => {
  const user = await Users.findByPk(req.params.UserId, {
    logging: console.log,
    include: {
      model: Reviews,
      attributes: ["reviewId","reviewDate", "reviewBody"],
      include: {
        model: Items,
        attributes: ["id","name"]
      }
    },
    order: [[Reviews,"reviewId","reviewBody"]]
  })
  if (user === null) {
    res.status(404).send({ error: "User not found" })
  } else {
    res.send(user)
  }
}
exports.updateById = async (req, res) =>{
    let users = await Users.findByPk(req.params.UserId, {logging: console.Log})
    if(users === null){
        res.status(404).send({"error": "No user found"})
        return
    } 
    try{
        users = await users.update(req.body, {logging:console.log})
    } catch (error){
        if (error instanceof db.Sequelize.ValidationError){
            res.status(400).send({"error": error.errors.map((item)=> item.message)})        
        }else{
            console.log("UsersUpdate", error) 
            res.status(500).send({"error": "Somthing went wrong on our side. Sorry :("})          
        }
        return
    }
    res.status(200)
    .location(`${getBaseUrl(req)}/users/${users.UserId}`)
    .json(users)
}
exports.deleteById = async (req, res) =>{
    const users = await Users.findByPk(req.params.UserId, {logging: console.Log})
    if(users === null){
        res.status(404).send({"error": "No user found"})
        return
    } 
    try{
        const deleted = await users.destroy()
    }
    catch (error){
        console.log("UsersDelete", error)
        res.status(500).send({"error": "Somthing went wrong on our side. Sorry :("})
        return
    }
    res.status(204).send()
}