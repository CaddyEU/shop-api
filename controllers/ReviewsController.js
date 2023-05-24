const { db }= require('../db');
const Reviews = db.reviews;
const User = db.users;
const Items = db.items;
const { getBaseUrl } = require('./helpers');
const QueryTypes = db.Sequelize.QueryTypes

exports.getAll = async (req, res) => {
  const review = await Reviews.findAll({
    attributes: [
      "id", 
      "reviewDate", 
      "reviewBody"
    ],
    include: [
      { model: User,
      attributes: [
        "UserName",
        "id"
      ]},
      { model: Items,
      attributes: [
        "id",
        "name"
      ]},         
    ],
  })
  if (review.length === 0) {
    res.send({ error: "No review stored." })
    return
  }
  res.send(review)
}

  exports.createNew = async (req, res) =>{
    let review
    try{
      review = await Reviews.create(req.body, 
            {
                logging:console.log, 
                fields: ["UserId","reviewDate", "ItemId", "reviewBody"]
            })
    } catch (error){
        if (error instanceof db.Sequelize.ValidationError){
            res.status(400).send({"error": error.errors.map((item)=> item.message)})        
        }
        else{
            console.log("ReviewCreate", error) 
            res.status(500).send({"error": "Something went wrong on our side. Sorry :("})          
        }
        return
    }
    res.status(201)
    .location(`${getBaseUrl(req)}/reviews/${review.id}`)
    .json(review)   
  }
 

exports.getById = async (req, res) =>{
    console.log("getById", req.params.id)
    const review = await Reviews.findByPk(req.params.id, {
      logging: console.log,
      include: ["User", "Item"],
    })
    console.log(review)
    if(review === null){
        res.status(404).send({"error": "No review found"})
    } else {
        res.send(review)
    }
}

exports.getreviewDate = async (req, res) =>{
  const review = await Reviews.findByPk(req.params.id, {
    include: [     
      { model: User, as: 'User'},
    ],
  })
  if(review === null){
      res.status(404).send({"error": "No review found"})
  } else {
      const sql = `SELECT reviews.reviewDate, 
                  reviews.id, reviews.reviewBody, users.UserName
                  FROM reviews
                  JOIN users ON reviews.UserId = users.UserId
                  WHERE users.UserId = ${review};`
const sqlResult = await db.sequelize.query(sql, { type: QueryTypes.SELECT })
      res.send(review)
  }
}


exports.updateById = async (req, res) =>{
  let review = await Reviews.findByPk(req.params.id, {logging: console.Log})
  if(review === null){
      res.status(404).send({"error": "No review found"})
      return
  } 
  try{
    review = await review.update(req.body, {logging:console.log})
  } catch (error){
      if (error instanceof db.Sequelize.ValidationError){
          res.status(400).send({"error": error.errors.map((item)=> item.message)})        
      }else{
          console.log("ReviewUpdate", error) 
          res.status(500).send({"error": "Something went wrong on our side. Sorry :("})          
      }
      return
  }
  res.status(200)
  .location(`${getBaseUrl(req)}/reviews/${review.reviewId}`)
  .json(review)
}

exports.deleteById = async (req, res) =>{
  const review = await Reviews.findByPk(req.params.id, {logging: console.Log})
  if(review === null){
      res.status(404).send({"error": "No review found"})
      return
  } 
  try{
      const deleted = await review.destroy()
  }
  catch (error){
      console.log("ReviewDelete", error) 
      res.status(500).send({"error": "Something went wrong on our side. Sorry :("})
      return
  }
  res.status(204).send()
}