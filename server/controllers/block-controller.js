'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository, blockRepository} from '../repositories'

export default class BlockController {
    createBlock  = async (req, res, next) => {
        try {
            const {userId, groupId} = req.body;
            const userlogin = req.user;
            const isMember =  await groupRepository.getAll({
                where: {
                    id: groupId,
                    [Op.or]: [
                        {
                            authorId: userId
                        },
                        {
                            partnerId: userId
                        }
                    ]
                }
            });
            if (!isMember) {
                return Response.returnError(res, new Error('User is not exist group'));
            }
            const block = await blockRepository.create({
                authorId: userlogin.id,
                userId: userId,
                groupId
            });
            return Response.returnSuccess(res, block);
        } catch (error) {
            return Response.returnError(res, error);
        }
    };
}