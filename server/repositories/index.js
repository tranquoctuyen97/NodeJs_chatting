import UserRepository from './user-repository';
import GroupRepository from './group-repository';
import MemberGroupRepository from './memberGroup-repository'
module.exports = {
    userRepository: new UserRepository(),
    groupRepository: new GroupRepository(),
    memberGroupRepository: new MemberGroupRepository(),
};
