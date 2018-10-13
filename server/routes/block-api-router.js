'use strict';

import {blockController } from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/blocks')
        .post([Authentication.isAuth], blockController.createBlock);
    app.route('/users/:id/block/:groupId')
        .post([Authentication.isAuth], blockController.createGroupBlockUser);
};
