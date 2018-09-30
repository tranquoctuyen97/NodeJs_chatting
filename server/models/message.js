'use strict';

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            authorId: {
                type: DataTypes.UUID
            },
            type: {
                type: DataTypes.STRING
            },
            body: {
                type: DataTypes.STRING
            },
            groupId: {
                type: DataTypes.UUID
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
            // classMethods: {
            //     generateHash(password) {
            //         return BCrypt
            //             .hash(password, 8)
            //             .then((data) => {
            //                 return data;
            //             })
            //             .catch(() => {
            //                 return falllse;
            //             });
            //     }
            // }
        }
    );

    // Association

    // User.associate = (models) => {
    //     User.hasMany(models.Group, {
    //         as: 'groups',
    //         foreignKey: 'authorId'
    //     });
    // };

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            as: 'author',
            foreignKey: 'authorId',
            onDelete: 'CASCADE'
        });
        Message.belongsTo(models.Group, {
            as: 'group',
            foreignKey: 'groupId',
            onDelete: 'CASCADE'
        });
    };


    // Static function

    // Hooks

    return Message;
};