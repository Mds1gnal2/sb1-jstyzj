import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    
    io.on('connection', socket => {
      console.log('Client connected:', socket.id);

      socket.on('create-room', (roomId) => {
        socket.join(roomId);
        socket.emit('room-created', roomId);
      });

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.emit('joined-room', roomId);
      });

      socket.on('screen-data', ({ roomId, data }) => {
        socket.to(roomId).emit('screen-data', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;