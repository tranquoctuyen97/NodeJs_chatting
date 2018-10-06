'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository,memberGroupRepository} from '../repositories'

export default class MemberGroupController {
    leaveGroup = async (req, res, next) => {
        try {
            const {id}= req.params;
            const userLoginId = req.user.id;
            const group = await groupRepository.getOne({
               where: {
                   id,
                   type: 'group',
               }
            });
            if (!group) {
                return Response.returnError(res, new Error('you cannot leave private group'))
            }
            await memberGroupRepository.delete({
               where: {
                   groupId: id,
                   userId: userLoginId,
               }
            });
            return Response.returnSuccess(res, 'leaved group')
        } catch (e) {
            return Response.returnError(res, e)
        }
    }
}