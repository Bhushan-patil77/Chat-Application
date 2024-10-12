const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: mongoose.Schema.Types.ObjectId,
    receiverId: mongoose.Schema.Types.ObjectId,
    content: String,
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports=MessageModel;