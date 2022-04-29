const mongoose = require('mongoose');

async function connectDB(){
    const res = await mongoose.connect('mongodb+srv://ayushbasak:ayush0210@cluster0.y2b7m.mongodb.net/docs?retryWrites=true&w=majority')
        .then(console.log('connected to database'))
        .catch(error => console.log(error));
}

connectDB();
const io = require('socket.io')(5000, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});


io.on('connection', (socket) => {
    socket.on('get-document', documentId => {
        const data = " a sample document";
        socket.join(documentId);
        socket.emit('load-document', data);
        socket.on('send-changes', delta => {
            console.log(delta);
            socket.broadcast.to(documentId).emit('recieve-changes', delta);
        })
    })

    console.log('A user connected to Web Socket Server');
});

io.on('disconnect', ()=> {
    console.log('User disconnected from Web Socket Server');
})