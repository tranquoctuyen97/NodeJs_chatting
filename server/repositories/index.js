import UserRepository from './user-repository';
import GroupRepository from './group-repository';
import MemberGroupRepository from './member-group-repository';
module.exports = {
    userRepository: new UserRepository(),
    groupRepository: new GroupRepository(),
    memberGroupRepository: new MemberGroupRepository(),
};
