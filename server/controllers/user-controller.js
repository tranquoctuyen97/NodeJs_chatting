'use strict';
import {User, Op, Block, Group} from '../models/index';
import {response, encryptHelper} from '../helpers';


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
            return response.returnSuccess(res, users);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    };
    createUser = async (req, res, next) => {
        try {
            const {username, password, address} = req.body;
            let hash = await encryptHelper.hashPassword(password);
            let newUser = await User.create({
                username,
                password: hash,
                address,
                role: "normal",
            });
            return response.returnSuccess(res, newUser);
        } catch (e) {
            return response.returnError(res, e)
        }
    }

}