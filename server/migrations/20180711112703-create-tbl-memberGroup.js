module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('MemberGroup', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    key: 'id',
                    model: 'User'
                },
                allowNull: false
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
        return queryInterface.dropTable('MemberGroup');
    }
};