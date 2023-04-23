const ItemsController = require("../controllers/ItemsController.js")
const UsersController = require("../controllers/UsersController.js")
const ReviewsController = require("../controllers/ReviewsController.js")

module.exports = (app) => {
    app.route("/items")
        .get(ItemsController.getAll)
        .post(ItemsController.createNew)    //Create
    app.route("/items/:id")
        .get(ItemsController.getById)       //Read
        .put(ItemsController.updateById)    //Update
        .delete(ItemsController.deleteById) //Delete

    app.route("/users")
        .get(UsersController.getAll)
        .post(UsersController.createNew)    //Create
    app.route("/users/:id")
        .get(UsersController.getById)       //Read
        .put(UsersController.updateById)    //Update
        .delete(UsersController.deleteById) //Delete
    
    app.route("/reviews")
        .get(ReviewsController.getAll)
        .post(ReviewsController.createNew)    //Create
    app.route("/reviews/:id")
        .delete(ReviewsController.deleteById) //Delete
}