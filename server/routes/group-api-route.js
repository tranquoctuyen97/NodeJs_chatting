'use strict';

import {groupController,memberGroupController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/groups')
<<<<<<< HEAD
        .get([Authentication.isAuth], groupController.getListActiveGroup)
=======
>>>>>>> fc50a95fa334cbb9eb3ee9913aa043f28b454fd4
        .post([Authentication.isAuth], groupController.createGroup);
    app.route('/groups/:id/leave')
        .delete([Authentication.isAuth], memberGroupController.leaveGroup);
    app.route('/groups/:id/join-group')
        .post([Authentication.isAuth], groupController.joinToGroup);
    app.route('/groups/:id/add-member')
        .post([Authentication.isAuth], groupController.addMemberToGroup);

};
