import UserRepository from './user-repository';
import GroupRepository from './group-repository';
import MemberGroupRepository from './memberGroup-repository';
import MessageRepository from './message-repository';
import BlockRepository from './block-repository';
module.exports = {
    userRepository: new UserRepository(),
    groupRepository: new GroupRepository(),
    memberGroupRepository: new MemberGroupRepository(),
    messageRepository: new MessageRepository(),
    blockRepository: new BlockRepository()
};
