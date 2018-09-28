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
}