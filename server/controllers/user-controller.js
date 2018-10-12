'use strict';
import {User, Op, Block, Group} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {userRepository} from '../repositories'

export default class UserController {

    getListUser = async (req, res, next) => {
        try {
        const { page, limit } = req.query;
        const offset = ( page - 1)  * limit;
        if (!page ) {
            return Response.returnError(res, new Error('Page is invalid '));
        } 
        if( !limit ) {
            return Response.returnError(res,new Error('Limit is invalid'));
        }
        
        if ( !(page % 1  == 0) || page < 1 ) {
            return Response.returnError(res, new Error('Page is invalid '))
        }
        
        if ( !(limit % 1  == 0) || limit < 1 ) {
            return Response.returnError(res, new Error('Limit is invalid '))
        }
        const users = await userRepository.getAll({
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: {
                exclude: ['password']
            },
            offset,
            limit
        });
        return Response.returnSuccess(res, users);
    } catch (e) {
        return Response.returnError(res,e);
    }
    };

    login = async (req, res, next) => {
        try {
            const {username, password} = req.body;
            if (username === undefined) {
                return Response.returnError(res, new Error('username is required field'));
            }
            if (password === undefined) {
                return Response.returnError(res, new Error('password id required filed'));
            }
            const user = await User.find(
                {
                    where: {
                        username
                    },
                    attributes: ['password', 'username', 'id']
                }
            );
            if (!user) {
                return Response.returnError(res, new Error('User is not found'));
            }
            const isValidPassword = await EncryptionHelper.compareTextHash(password, user.password);
            if (!isValidPassword) {
                return Response.returnError(res, new Error('Wrong password'));
            }
            // Gen token
            const token = await JWTHelper.sign({
                id: user.id,
                username: user.username
            });
            return Response.returnSuccess(res, {
                token,
                id: user.id
            });
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

    getOneUser = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = await userRepository.getOne({
                where: {
                    id
                },
            });
            if (!user) {
                return Response.returnError(res, new Error ('User is not found'));
            }
            return Response.returnSuccess(res, {
                success: true,
                data: user
            });
        } catch (e) {
            return Response.returnError(res, new Error (e.message));
        }
    };

    createUser = async (req, res, next) => {
        try {
            const {role, username, password, address} = req.body;
            let hash = await EncryptionHelper.hash(password);
            await userRepository.create({
                username,
                password: hash,
                address,
                role,
            });
            return Response.returnSuccess(res, 'success');
        } catch (e) {
            return Response.returnError(res, e)
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username, address } = req.body;
            const userLoginId = req.user.id;

            if ( id !== userLoginId)
            {
                return Response.returnError(res, new Error('You are not author!'));
            }
            const updatedUser = await userRepository.update(
                {
                    username,
                    address
                },
                {
                    where: {
                        id
                    },
                    returning: true
                }
            );
            if (updatedUser[0] === 0)
            {
                return Response.returnError(res, new Error('Cannot update user'));
            }
            return Response.returnSuccess(res, updatedUser[1]);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            await userRepository.delete({
                where: {
                    id
                }
            });
            return Response.returnSuccess(res, {
                success: "true"
            });
        } catch (e) {
            return Response.returnError(res, e);
        }
    };
    updateActiveUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { isActive } = req.body;           
            if( isActive === null || isActive === undefined ) {
                return Response.returnError(res, new Error('isActive is invalid '));
            }
            if ( typeof isActive !== 'boolean' ) {
                return Response.returnError(res, new Error('isActive is boolean'));
            }
            if ( !id ) {
                return Response.returnError(res, new Error('id is invalid'));
            }
            const updateActive = await userRepository.update(
                {

                     isActive

                 },
                {

                    where: {
                        id
                    },
                }
            );
            return Response.returnSuccess(res, updateActive[0]);
        } catch (error) {
            return Response.returnError(res, error);
        }
    };
    getUserByUsername = async (req, res, next) => {
        try {
            const {username} = req.body;
            if (username === undefined) {
                return Response.returnError(res, new Error('username is required field'));
            }
            const user = await userRepository.getOne({
                where: {
                    username,
                },
                attributes: {
                    exclude: ['password']
                },
            });
            console.log(user);
            if (!user) {
                return Response.returnError(res, new Error ('User is not found'));
            }
            return Response.returnSuccess(res, user);
        } catch (e) {
            return Response.returnError(res, e);
        }
    }
}