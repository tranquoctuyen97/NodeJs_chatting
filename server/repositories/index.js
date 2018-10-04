import UserRepository from './user-repository';
import GroupRepository from './group-repository'
module.exports = {
    userRepository: new UserRepository(),
    groupRepository: new GroupRepository(),
  
};
