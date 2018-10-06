'use strict';

import {groupController,memberGroupController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/groups')
        .get([Authentication.isAuth], groupController.getListActiveGroup)
        .post([Authentication.isAuth], groupController.createGroup);
    app.route('/groups/:id/leave')
        .delete([Authentication.isAuth], memberGroupController.leaveGroup);
};
