'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository, memberGroupRepository} from '../repositories'

export default class GroupController {
    createGroup = async (req, res, next) => {
        let newGroup = null;
        try {
            let {name, type, partnerId, memberIds} = req.body;
            const authorId = req.user.id;
            if (!type) {
                return Response.returnError(res, new Error('type of group is required field'))
            }
            switch (type) {
                case 'private':
                    if (partnerId === undefined) {
                        return Response.returnError(res, new Error('partner is required for private group'))
                    }
                    const existGroup = await groupRepository.getOne({
                        where: {
                            [Op.or]: [
                                {
                                    authorId,
                                    partnerId,
                                },
                                {
                                    authorId: partnerId,
                                    partnerId: authorId,
                                }
                            ]
                        }
                    });
                    if (existGroup) {
                        return Response.returnSuccess(res, existGroup);
                    }
                    memberIds = [authorId, partnerId];
                    break;
                case 'group':
                    if(memberIds === undefined|| !Array.isArray(memberIds)|| memberIds.length < 0) {
                        return Response.returnError(res, new Error('member is invalid'));
                    }
                    if (memberIds.includes(authorId)) {
                        memberIds[memberIds.length] = authorId;
                    }
                    break;
                default:
                    return Response.returnError(res, new Error('type is invalid'));
            }
            newGroup = await groupRepository.create({
               name,
                type,
                authorId,
                partnerId,
            });
            const member = memberIds.map(item => {
                return {
                    groupId : newGroup.id,
                    userId: item,
                }
            });
            await memberGroupRepository.bulkCreate(member);
            const group = await groupRepository.getOne({
                where: {
                    id: newGroup.id,
                }
            })
            return Response.returnSuccess(res, group);
        } catch (e) {
            if (newGroup) {
                 groupRepository.delete({
                    force : true,
                    where: {
                        id: newGroup.id,
                    }
                })
            }
            return Response.returnError(res, e)
        }
    }
}