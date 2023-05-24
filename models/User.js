module.exports = (sequelize,Sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserName:{
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    return User
}