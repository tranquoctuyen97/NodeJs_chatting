'use strict';

import {userController} from '../controllers';
import {Validation} from '../middlewares';

module.exports = (app) => {

	app.route('/users')
		.get( userController.getListUser)
		.post([Validation.validationCreateUser],userController.createUser)
};
