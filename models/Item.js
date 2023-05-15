module.exports = (sequelize,Sequelize) => {
    const Item = sequelize.define("Item", {
        ItemId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ItemName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description:{
            type: Sequelize.STRING(4096)
        },
        category:{
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT
        },
        posted: {
            type: Sequelize.DATEONLY
        }
    })
    return Item
}