'user strict';
import {Response} from '../helpers';

export default class  Validation {
    static validateEmail = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    static validationCreateUser (req, res, next) {
        const {username, password, address} = req.body;
        if (username === '' || username === undefined){
            return Response.returnError(res, new Error('username empty'));
        }
        if (!Validation.validateEmail(username)){
            return Response.returnError(res, new Error('username not email'));
        }
        if (password === '' || password === undefined){
            return Response.returnError(res, new Error('password empty'));
        }
        if (!Array.isArray(address)|| address.length === 0) {
            return Response.returnError(res, new Error('address not invalid'));
        }
        return next();

    }

}