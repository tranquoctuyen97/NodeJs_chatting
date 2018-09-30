'use strict';
import {User, Op, Block, Group} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {userRepository} from '../repositories'

export default class UserController {

    getListUser = async (req, res, next) => {
        try {
            const users = await User.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        model: Block,
                        as: 'blocks',
                        required: false
                    }
                ],
            });
            return Response.returnSuccess(res, users);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
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
<<<<<<< HEAD
            const {username, password, address} = req.body;
=======
            const {role, username, password, address} = req.body;
>>>>>>> feature/thuyngan
            let hash = await EncryptionHelper.hash(password);
            let newUser = await User.create({
                username,
                password: hash,
                address,
<<<<<<< HEAD
                role: "normal",
=======
                role,
>>>>>>> feature/thuyngan
            });
            return Response.returnSuccess(res, newUser);
        } catch (e) {
            return Response.returnError(res, e)
        }
<<<<<<< HEAD
    }
=======
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
>>>>>>> feature/thuyngan
}