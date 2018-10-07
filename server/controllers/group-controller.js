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
            });
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
    };

    addMemberToGroup = async (req, res, next) => {
        try {
            const userLoginId = req.user.id;
            const {memberIds} = req.body;
            const groupId = req.params.id;
            let memberGroupIds = [];
            let newMemberGroups = [];

            if (memberIds === undefined || !Array.isArray(memberIds) || memberIds.length === 0) {
                return Response.returnError(res, new Error('Member group is invalid'));
            }

            const memberGroup = await memberGroupRepository.getAll({
                where: {
                    groupId
                },
                attributes: ['userId']
            });

            if (!memberGroup) {
                return Response.returnError(res, new Error('Group not found'));
            }

            for (let member of memberGroup) {
                memberGroupIds.push(member.userId)
            }

            if (!memberGroupIds.includes(userLoginId)) {
                return Response.returnError(res, new Error('User was not in that group'));
            }

            for (let memberId of memberIds) {
                if (memberId !== userLoginId && !memberGroupIds.includes(memberId)) {
                    memberGroupIds.push(memberId);
                    newMemberGroups.push(memberId);
                }
            }

            const memberGroups = newMemberGroups.map(item => {
                return {
                    userId: item,
                    groupId: groupId
                }
            });

            let newMembers = await memberGroupRepository.bulkCreate(memberGroups);
            return Response.returnSuccess(res, newMembers);
        } catch (e) {
            return Response.returnError(res, e.message);
        }
    };

    joinToGroup = async (req, res, next) => {
        try {
            const userLoginId = req.user.id;
            const groupId = req.params.id;
            let memberGroupIds = [];
            const memberGroup = await memberGroupRepository.getAll({
                where: {
                    groupId
                },
                attributes: ['userId']
            });

            if (!memberGroup) {
                return Response.returnError(res, new Error('Group not found'));
            }

            for (let member of memberGroup) {
                memberGroupIds.push(member.userId)
            }

            if (memberGroupIds.includes(userLoginId)) {
                return Response.returnError(res, new Error('User had been in that group'));
            }

            const newMemberInGroup = await MemberGroup.create(
                {
                    userId: userLoginId,
                    groupId,
                });
            return Response.returnSuccess(res, newMemberInGroup);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };
    getListMembersInGroup = async (req, res) => {
        try {
            const { id } = req.params;
            const member = await  memberGroupRepository.getAll({
                where: {
                    groupId: id
                },
                attributes: ['id', 'userId']
            });
            if (member.length === 0) {
                return Response.returnError(res, new Error('Group is not Exist'))
            }
            return Response.returnSuccess(res, member);
        } catch (e) {
            return Response.returnSuccess(res, e);
        }
    };

    removeMemberInGroup = async (req, res, next) => {
        try {
            const { id, memberId }= req.params;
            const userLoginId = req.user.id;
            const isAuthor = groupRepository.getOne({
                where: {
                    id,
                    authorId: userLoginId
                }
            });
            if (!isAuthor) {
                return Response.returnError(res, new Error('You are not author of group'));
            }
            const deleted = await  memberGroupRepository.delete({
                where: {
                    id: memberId,
                    groupId: id
                }
            });
            if (deleted === 0) {
                return Response.returnError(res, new Error('Remove member in group wrong!'));
            }
            return Response.returnSuccess(res, 'Removed member')
        } catch (e) {
            return Response.returnError(res, e)
        }
    }
    test = async (req, res, next) => {
        Response.returnSuccess(res, {
            data: "ok"
        })
    }
}