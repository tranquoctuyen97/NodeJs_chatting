'use strict';

import {userController} from '../controllers';


module.exports = (app) => {

	app.route('/users')
		.get( userController.getListUser)


};
