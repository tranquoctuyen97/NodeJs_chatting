'use strict';
import {User, Op, Block, Group} from '../models/index';
import {response} from '../helpers';


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

}