const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const connectDB = require('./connectDB')
connectDB();

const DocumentModel = require('./DocumentModel');

app.listen(5001, () => console.log('REST server running on port 5001'));

app.get('/', async (req, res) => {
    if(req.query.id !== undefined){
        const document = await DocumentModel.findOne({id: req.query.id})
        if(document !== null){
            res.send(document);
        }
        else{
            res.status(404).send('Document not found');
        }
    }
    else{
        await DocumentModel.find()
            .then(documents => res.send(documents))
            .catch(error => res.status(500).send(error));
    }
});

app.post('/', async (req, res) => {
    const document = new DocumentModel({
        contents: req.body.contents,
        id: req.query.id
    });
    await document.save()
        .then(console.log(`created a new document with id ${document.id}`))
        .catch(error => res.status(500).send(error));
});

app.put('/', async (req, res) => {
    const documentId = req.query.id;
    const contents = req.body.contents;
    await DocumentModel.findOneAndUpdate({id: documentId}, {contents: contents})
        .then(console.log(`updated document with id ${documentId}`))
        .catch(error => res.status(500).send(error));
});

app.delete('/', async (req, res) => {
    const documentId = req.query.id;
    if(documentId !== undefined){
        await DocumentModel.findOneAndDelete({id: documentId})
            .then(console.log(`deleted document with id ${documentId}`))
            .catch(error => res.status(500).send(error));
    }
    else {
        await DocumentModel.deleteMany()
            .then(console.log(`deleted all documents`))
            .catch(error => res.status(500).send(error));
    }
});

const io = require('socket.io')(5000, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});


io.on('connection', (socket) => {
    socket.on('get-document', async documentId => {
        const data = await DocumentModel.findOne({id: documentId});
        socket.join(documentId);
        socket.emit('load-document', data);
        socket.on('send-changes', delta => {
            console.log(delta);
            socket.broadcast.to(documentId).emit('recieve-changes', delta);
        })
    })

    console.log('A user connected to Web Socket Server');
});