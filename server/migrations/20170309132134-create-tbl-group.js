module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('Group', {
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
            name: {
                type: DataTypes.STRING
            },
            type: {
                type: DataTypes.ENUM,
                values: ['private', 'group']
            },
            partnerId: {
                type: DataTypes.UUID,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            avatar: {
                type: DataTypes.STRING
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
        return queryInterface.dropTable('Group');
    }
};
///create new migration files for insert colum , update colum properties, remove colum