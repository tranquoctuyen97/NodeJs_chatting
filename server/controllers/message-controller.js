'use strict';
import {User, Op, Block, Group, MemberGroup,} from '../models/index';
import {Response} from '../helpers';
import {messageRepository, blockRepository, memberGroupRepository} from '../repositories'

export default class MessageControlle {
    createMessage = async (req, res, next) => {
        try {
            const authorId = req.user.id;
            const groupId = req.params.id;
            let {type, body} = req.body;
            let listBlock = await blockRepository.getAll({
                where: {
                    [Op.or]: [
                        {
                            groupId,
                        },
                        {
                            authorId,
                        }
                    ]
                },
                attributes: ['userId', 'authorId'],
            });
            let listUserBlock = [];
            if (listUserBlock.length > 0) {
                for(let item of listBlock) {
                    if (item.userId !== null) {
                        listUserBlock.push(item.userId);
                    }
                    if (item.authorId !== null) {
                        listUserBlock.push(item.authorId);
                    }
                }
            }
            let isAlreadyBlocked = await memberGroupRepository.getOne({
                where: {
                    groupId,
                    userId: {
                        [Op.in] : listUserBlock,
                    }
                },
                attributes: (['id']),
            });
            if (isAlreadyBlocked !== null) {
                return Response.returnError(res, new Error('User is already blocked'));
            }
            let newMessage = await messageRepository.create({
                type,
                body,
                authorId,
                groupId
            });
            return Response.returnSuccess(res, newMessage);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };
    updateMessage = async (req, res, next) => {
        try {
            const groupId = req.params.id;
            const {id, body, type} = req.body;
            const authorId = req.user.id;
            const updatedMessage = await messageRepository.update(
                {
                    groupId,
                    body,
                    type
                },
                {
                    where: {
                        id,
                        authorId
                    },
                    returning: true
                }
            );
            if (updatedMessage[0] === 0) {
                return Response.returnError(res, new Error('Can not update Message'));
            }
            return Response.returnSuccess(res, updatedMessage[1]);
        } catch (e) {
            return Response.returnError(res, e);
        }
    }
}