import mongoose  from "mongoose";
import { Schema } from "mongoose";
import User from "./user.model.js";

const chatSchema = new mongoose.Schema({
    participants : [
        {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    ],
    isGroup : {
        type : Boolean,
        default : false,
        required : true
    }, 
    groupName : {
        type : String,
        trim : true
    },
    admin : {
        type : Schema.Types.ObjectId,
    },
    avatar : {
        type : String
    }

});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;