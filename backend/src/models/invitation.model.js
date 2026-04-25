
import mongoose from 'mongoose';

import User from "./user.model.js";
import { Schema } from 'mongoose';

const invitationSchema = new mongoose.Schema({
    from : {
        required : true,
        ref : "User",
        type : Schema.Types.ObjectId
    }, 
    to : {
        required : true, 
        ref : "User",
        type : Schema.Types.ObjectId
    },
    status : {
        type : String,
        enum : ['pending', 'accepted', 'rejected'],
        default : 'pending',
    },
    rejectedAt : {
        type : Date
    }

}, {timestamps : true});

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;