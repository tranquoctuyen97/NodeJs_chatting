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