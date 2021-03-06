import sio from 'socket.io';
import handlerFactory from './handler'; 

export let io;

export default (server, cookieParser, session) => {
    
    // configure socket.io
    io = sio(server);
    io.use((socket, next) => {
        const req = socket.handshake;
        const res = {};
        cookieParser(req, res, err => {
            if(err) return next(err);
            session(req, res, next);
        });
    });

    // handle connections
    io.on('connection', socket => {
        
        const handler = handlerFactory(io, socket);

        socket.on('join-channel', handler.joinChannel);
        socket.on('disconnect', handler.disconnect);
        socket.on('device-orientation', handler.deviceOrientation);
        socket.on('calibrate-orientation', handler.calibrateOrientation);

    });
};