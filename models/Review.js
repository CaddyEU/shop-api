module.exports = (sequelize, Sequelize, Item, User) => {
    const Review = sequelize.define("Review", {
        reviewId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reviewDate: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true}
        },
        reviewBody: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        ItemId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Item,
                key: "id"
            }
        },
        UserId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "UserId"
            }
        }
    })

    Item.belongsToMany(User, { through: Review})
    User.belongsToMany(Item, { through: Review})
    Item.hasMany(Review)
    Review.belongsTo(Item)
    User.hasMany(Review)
    Review.belongsTo(User)
    return Review

}