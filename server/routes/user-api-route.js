'use strict';

import {userController} from '../controllers';
import {Authentication} from '../middlewares';


module.exports = (app) => {

    app.route('/users')
        .get([Authentication.isAuth], userController.getListUser);

    app.route('/users/:id')
        .get([Authentication.isAuth], userController.getOneUser);

    app.route('/login')
        .post(userController.login);

};
