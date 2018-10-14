'use strict';
import {User, Op, Block, Group, MemberGroup, Message} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository, blockRepository, memberGroupRepository, messageRepository} from '../repositories';

export default class MessageController {
    getListMessages = async (req, res, next) => {
        try {
            const groupId = req.params.id;
            const userLoginId = req.user.id;
            const memberGroupIds = [];
            const {page, limit} = req.query;
            const offset = (page - 1) * limit;
            const memberGroup = await memberGroupRepository.getAll({
                where: {
                    groupId
                },
                attributes: ['userId']
            });
            if (!memberGroup) {
                return Response.returnError(res, new Error('Group is not found'));
            }
            for (let member of memberGroup) {
                memberGroupIds.push(member.userId)
            }
            if (!memberGroupIds.includes(userLoginId)) {
                return Response.returnError(res, new Error('User is not in this group'));
            }
            const messages = await messageRepository.getAll({
                where: {
                    groupId
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: {
                            exclude: ['password']
                        }
                    }
                ],
                order: [
                    ['createdAt','DESC']
                ],
                limit,
                offset,
            });
            return Response.returnSuccess(res, messages);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

}