'user strict';
import { Response } from  '../helpers';
export default class  RoleManagement {
    static isAdmin = async (req, res, next) => {
        try {
            const user = req.user;
            const role = user.role;
            if (role === 'admin') {
                return next();
            }
            return Response.returnError(res, new Error ("You are not admin"));
        } catch (e) {
            return Response.returnError(res, e);
        }
    }
}
