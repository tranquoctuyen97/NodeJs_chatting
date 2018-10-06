'use strict';
import {User, Op, MemberGroup, Group} from '../models/index';
import {Response} from '../helpers';
import {groupRepository, memberGroupRepository} from '../repositories';

export default class GroupController {
    createGroup = async (req, res, next) => {
        let newGroup = null;
        try {
            const userLoginId = req.user.id;
            const {name, type, memberIds, partnerId} = req.body;
            let memberGroupIds = [];
            switch (type) {
                case 'private':
                    if (partnerId === undefined) {
                        return Response.returnError(res, new Error('partnerId is required field'));
                    }
                    const existingGroup = await groupRepository.getOne({
                        where: {
                            [Op.or]: [
                                {
                                    authorId: userLoginId,
                                    partnerId: partnerId
                                },
                                {
                                    partnerId: userLoginId,
                                    authorId: partnerId
                                }
                            ]
                        }
                    });
                    if (existingGroup) {
                        return Response.returnSuccess(res, existingGroup);
                    }
                    memberGroupIds = [userLoginId, partnerId];
                    break;
                case 'group':
                    if (name === undefined) {
                        return Response.returnError(res, new Error('Name group is required field'));
                    }
                    if (memberIds === undefined || !Array.isArray(memberIds) || memberIds.length === 0) {
                        return Response.returnError(res, new Error('Member group is invalid'));
                    }
                    if (!memberIds.includes(userLoginId)) {
                        memberIds[memberIds.length] = userLoginId;
                    }
                    memberGroupIds = memberIds;
                    break;
                default:
                    return Response.returnError(res, new Error('Invalid type group'));
            }
            newGroup = await groupRepository.create({
                name,
                authorId: userLoginId,
                type,
                partnerId
            });
            const memberGroups = memberGroupIds.map(item => {
                return {
                    userId: item,
                    groupId: newGroup.id
                }
            });
            await memberGroupRepository.bulkCreate(memberGroups);
            if (res !== undefined) {
                return Response.returnSuccess(res, newGroup);
            } else {
                newGroup.memberGroupIds = memberGroupIds;
                return newGroup;
            }
        } catch (e) {
            if (newGroup) {
                groupRepository.delete({
                    force: true,
                    where: {
                        id: newGroup.id
                    }
                });
            }
            return Response.returnError(res, e.message);
        }
    };

    addMemberToGroup = async (req, res, next) => {
        try {
            const userLoginId = req.user.id;
            const {groupId, memberIds} = req.body;
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
            return Response.returnSuccess(res, {
                success: "true",
                data: newMembers
            });
        } catch (e) {
            return Response.returnError(res, e.message);
        }
    };

    joinToGroup = async (req, res, next) => {
        try {
            const {groupId} = req.body;
            const userId = req.user.id;
            const group = await groupRepository.find({
                where: {
                    id: groupId
                },
                attributes: (['createdAt'])
            });
            if (!group) {
                return Response.returnError(res, new Error('group dose not exist'))
            }
            const newMemberInGroup = await MemberGroup.create(
                {
                    userId,
                    groupId,
                });
            return Response.returnSuccess(res, newMemberInGroup);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

}