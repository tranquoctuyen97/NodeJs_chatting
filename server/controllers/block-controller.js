'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository, memberGroupRepository, blockRepository} from '../repositories'

export default class BlockController {
    getListGroupBlockUser = async (req, res, next) => {
        try {
            const userLoginId = req.user.id;
            const groupId = req.params.id;
            const memberGroupIds = [];
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
            const blocks = await blockRepository.getAll({
                where: {
                    groupId
                }
            });
            return Response.returnSuccess(res, blocks);
        } catch(e) {
            return Response.returnError(res, e);
        }
    };


}