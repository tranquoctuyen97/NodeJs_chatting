'use strict';

module.exports = (sequelize, DataTypes) => {
    const Block = sequelize.define('Block',
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
            groupId: {
                type: DataTypes.UUID
            },
            userId: {
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
            //                 return false;
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


    Block.associate = (models) => {
        Block.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        Block.belongsTo(models.Group, {
            as: 'group-block',
            foreignKey: 'groupId',
            onDelete: 'CASCADE'
        });
        Block.belongsTo(models.User, {
            as: 'author',
            foreignKey: 'authorId',
            onDelete: 'CASCADE'
        });
    };


    // Static function

    // Hooks

    return Block;
};