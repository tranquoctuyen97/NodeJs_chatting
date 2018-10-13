'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository, blockRepository, memberGroupRepository} from '../repositories'

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
    createGroupBlockUser = async (req, res, next) => {
        try {
            const  user = req.user;
            const { id ,groupId } = req.params;
            if ( !id ) {
                return Response.returnError(res, new Error('Id is invalid'));
            }
            if ( !groupId ) {
                return Response.returnError(res, new Error('groupId is invalid'));
            }
            const author = await groupRepository.getOne({
                where: {
                    id: groupId,
                    authorId: user.id
                },
                attributes: ['id']
                
            });
            const isMember = await memberGroupRepository.getOne({
                where: {
                    groupId,
                    userId: id
                },
                attributes: ['id']
            });
            if (!isMember) {
                return Response.returnError(res, new Error('user is not member group '));
            }
            if (!author) {
                return Response.returnError(res, new Error('author is not admin group '));
            }
            const block = await Block.create({
                userId: id,
                groupId
            });
            return Response.returnSuccess(res, block);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };
}