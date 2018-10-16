import { Authentication } from '../middlewares';

export default class SocketInitialization {

    static connect (io) {
        io
            .use(async (socket, next) => {
                try {
                    await Authentication.authenticateSocket(socket);
                    next();
                } catch (e) {
                    return next(e);
                }
            })
            .on('connection', function (socket) {
                console.log('-----------Socket connect------------');

                socket.on('disconnect', function () {
                    console.log('-----------Socket disconnect------------');

                });
            });
    }

}