const mongoose = require('mongoose');
const DocumentSchema = new mongoose.Schema({
    contents: String,
    id: String
});

const DocumentModel = mongoose.model('Document', DocumentSchema);

module.exports = DocumentModel;