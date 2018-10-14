    'use strict';

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING
            },
            authorId: {
                type: DataTypes.UUID
            },
            partnerId: {
                type: DataTypes.UUID,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            type: {
                type: DataTypes.ENUM,
                values: ['private', 'group']
            },
            avatar: {
                type: DataTypes.STRING
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE
            }
        },
        {
            paranoid: true,//xóa mềm: soft delete
            freezeTableName: true,

        }
    );
    Group.associate = (models) => {
        Group.belongsTo(models.User, {
            as: 'author',
            foreignKey: 'authorId',
            onDelete: 'CASCADE'
        });
        Group.hasMany(models.Block, {
            as: 'blocks',
            foreignKey: 'groupId',
        });
        Group.hasMany(models.MemberGroup, {
            foreignKey: 'groupId',
            as: 'members'
        });

    };
    return Group;
};