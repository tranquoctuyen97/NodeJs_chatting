'use strict';

import {messageController} from '../controllers';
import { Authentication} from '../middlewares';



module.exports = (app) => {

    app.route('/group/:id/message')
        .post([Authentication.isAuth], messageController.createMessage)
        .put([Authentication.isAuth], messageController.updateMessage)
};
