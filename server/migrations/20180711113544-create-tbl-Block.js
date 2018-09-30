module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('Block', {
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
                }
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    key: 'id',
                    model: 'User'
                }
            },
            groupId: {
                type: DataTypes.UUID,
                references: {
                    key: 'id',
                    model: 'Group'
                }
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
        return queryInterface.dropTable('Block');
    }
};
///create new migration files for insert colum , update colum properties, remove colum