import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import Chat from "./chat.model.js";

const notificationSchema = new mongoose.Schema({
    receiver : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    message : {
        type : String
    },
})

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;