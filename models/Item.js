module.exports = (sequelize,Sequelize) => {
    const Item = sequelize.define("Item", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
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
        posted: {
            type: Sequelize.DATEONLY
        }
    })
    return Item
}