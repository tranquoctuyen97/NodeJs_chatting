module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('User', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                    min: 5,
                    max: 255
                },
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    max: 120,
                    min: 10
                }
            },
            role: {
                type: DataTypes.ENUM,
                values: ['normal', 'admin']
            },
            avatar: {
                type: DataTypes.STRING
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            address: {
                type: DataTypes.ARRAY(DataTypes.STRING)
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            deletedAt: {
                type: DataTypes.DATE
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('User');
    }
};