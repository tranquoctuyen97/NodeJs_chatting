'use strict';

module.exports = (sequelize, DataTypes) => {
    const MemberGroup = sequelize.define('MemberGroup',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID
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

    MemberGroup.associate = (models) => {
        MemberGroup.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        MemberGroup.belongsTo(models.Group, {
            foreignKey: 'groupId',
            as: 'group',
            onDelete: 'CASCADE'
        });

    };


    // Static function

    // Hooks

    return MemberGroup;
};