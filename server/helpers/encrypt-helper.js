'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
let salt = bcrypt.genSaltSync(saltRounds);
export default class EncryptHelper {
     hashPassword = (data) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(data, salt, function(err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        });
    };

     isValidPassword = (data, hash) => {
         return new Promise((resolve, reject) => {
             bcrypt.compare(data, hash, function(err, res) {
                if (res === true) {
                    resolve (true)
                } else {
                    reject (false   )
                }
             });
         });
     }

}