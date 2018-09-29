'use strict';

import {userController} from '../controllers';
import {Authentication} from '../middlewares';
import {Validation} from '../middlewares';


module.exports = (app) => {

    app.route('/users')
        .get([Authentication.isAuth], userController.getListUser)
        .post([Validation.validationCreateUser],userController.createUser);

    app.route('/users/:id')
        .get([Authentication.isAuth], userController.getOneUser);

    app.route('/login')
        .post(userController.login);

};
