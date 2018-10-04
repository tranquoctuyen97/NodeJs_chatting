'use strict';
import {User, Op, Block, Group, MemberGroup} from '../models/index';
import {Response, EncryptionHelper, JWTHelper} from '../helpers';
import {groupRepository} from '../repositories'

export default class GroupController {
    createGroup = async (req, res, next) => {
        try {
            const {name, type} = req.body;
            const authorId = req.user.id;
            const newGroup = await groupRepository.create({
                    name,
                    authorId,
                    type,
                    members:{
                        userId: authorId,
                    }
                },
                {
                    include: [
                        {
                            model: MemberGroup,
                            as: 'members'
                        }
                    ]
                });
            return Response.returnSuccess(res, newGroup)
        } catch (e) {
            return Response.returnError(res, e)
        }
    }
}