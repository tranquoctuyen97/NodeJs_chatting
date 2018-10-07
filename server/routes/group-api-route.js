'use strict';

import {groupController,memberGroupController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/groups')
        .post([Authentication.isAuth], groupController.createGroup);
    app.route('/groups/:id/leave')
        .delete([Authentication.isAuth], memberGroupController.leaveGroup);
    app.route('/groups/:id/join-group')
        .post([Authentication.isAuth], groupController.joinToGroup);
    app.route('/groups/:id/add-member')
        .post([Authentication.isAuth], groupController.addMemberToGroup);
    app.route('/groups/:id/members')
        .get([Authentication.isAuth], groupController.getListMembersInGroup);
    app.route('/groups/:id/:memberId')
        .delete([Authentication.isAuth], groupController.removeMemberInGroup);




};
