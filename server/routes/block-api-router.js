'use strict';

import {blockController } from '../controllers';
import { Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/blocks')
        .get([Authentication.isAuth], blockController.getListBlockUsers)
        .post([Authentication.isAuth], blockController.createBlock);
    app.route('/users/:id/block/:groupId')
        .post([Authentication.isAuth], blockController.createGroupBlockUser);

    app.route('/users/:id/remove-block/:groupId')
        .post([Authentication.isAuth], blockController.removeBlockUser);
};
