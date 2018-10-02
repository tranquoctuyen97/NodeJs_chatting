'use strict';

import {userController} from '../controllers';
import { Authentication, Validation, RoleManagement} from '../middlewares';


module.exports = (app) => {

    app.route('/users')
        .get([Authentication.isAuth, RoleManagement.isAdmin], userController.getListUser)
        .post([Validation.validationCreateUser],userController.createUser);

    app.route('/users/:id')
        .get([Authentication.isAuth], userController.getOneUser)
        .put([Authentication.isAuth],userController.updateUser)
        .delete([Authentication.isAuth, RoleManagement.isAdmin], userController.deleteUser);

    app.route('/login')
        .post(userController.login);


};
