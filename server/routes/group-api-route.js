'use strict';

import {groupController} from '../controllers';
import { Authentication, RoleManagement} from '../middlewares';


module.exports = (app) => {

    app.route('/group')
        .post([Authentication.isAuth], groupController.createGroup)
};
