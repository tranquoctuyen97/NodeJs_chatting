module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('Message', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            authorId: {
                type: DataTypes.UUID,
                references: {
                    key: 'id',
                    model: 'User'
                },
                allowNull: false
            },
            type: {
                type: DataTypes.STRING
            },
            body: {
                type: DataTypes.STRING
            },
            groupId: {
                type: DataTypes.UUID,
                references: {
                    key: 'id',
                    model: 'Group'
                },
                allowNull: false
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
        return queryInterface.dropTable('Message');
    }
};
///create new migration files for insert colum , update colum properties, remove colum