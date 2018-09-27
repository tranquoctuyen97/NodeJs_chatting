'use strict';
export default class Response {
      returnSuccess (res, data)  {
        return res.status(200).json({
            success: true,
            data: data
        });
    };
     returnError (res, error)  {
         console.error(error);
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
}