'use strict';

import {groupController,memberGroupController, messageController} from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/groups/:id/messages')
        .get([Authentication.isAuth], messageController.getListMessages);
};