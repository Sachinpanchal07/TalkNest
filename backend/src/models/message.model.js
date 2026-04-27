import mongoose  from "mongoose";
import { Schema } from "mongoose";
import User from "./user.model.js";
import Chat from "./chat.model.js";

const messageSchema = new mongoose.Schema({
    chatId : {
        type : Schema.Types.ObjectId,
        ref : "Chat",
        required : true
    },
    text : {
        type : String
    },
    senderId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : ["sent", "delivered", "seen"],
        default : 'sent'
    }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;