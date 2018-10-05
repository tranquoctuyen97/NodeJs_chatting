'use strict';

import {groupController,memberGroupController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/group')
        .post([Authentication.isAuth], groupController.createGroup);
    app.route('/group/:id/leave')
        .delete([Authentication.isAuth], memberGroupController.leaveGroup);
};
