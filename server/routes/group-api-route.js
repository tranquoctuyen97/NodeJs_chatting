'use strict';

import {groupController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/groups')
        .post([Authentication.isAuth], groupController.createGroup);

    app.route('/groups/add-member-to-group')
        .post([Authentication.isAuth], groupController.addMemberToGroup);

};
