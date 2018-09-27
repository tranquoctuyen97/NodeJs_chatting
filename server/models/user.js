'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                unique: {
                    args: true,
                    msg: 'USERNAME_ALREADY_USING'
                },
                validate: {
                    isEmail: {
                        msg: 'USERNAME_INVALID'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    max: 25,
                    min: 10
                }
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
            role: {
                type: DataTypes.ENUM,
                values: ['normal', 'admin'],
                defaultValue: 'normal'
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
            classMethods: {
                generateHash(password) {
                    return BCrypt
                        .hash(password, 8)
                        .then((data) => {
                            return data;
                        })
                        .catch(() => {
                            return false;
                        });
                }
            }
        }
    );

    // Association

    User.associate = (models) => {
        User.hasMany(models.Group, {
            as: 'groups',
            foreignKey: 'authorId'
        });
        User.hasMany(models.Block, {
           as: 'blocks',
           foreignKey: 'authorId'
        });
    };

    // User.associate = (models) => {
    //     User.belongsTo(models.Name, {
    //         foreignKey: 'id',
    //         onDelete: 'CASCADE'
    //     });
    // };

    // Static function

    // Hooks

    return User;
};