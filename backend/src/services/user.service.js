import User from "../models/user.model.js"
import Invitation from "../models/invitation.model.js";

// Search random Users 
export async function findUsersByQuery(query) {
    try {
        const searchRegex = new RegExp(query, 'i');

        const users = await User.find({
            $or: [
                { username: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ]
        }).select("-password");
        console.log(users);
        return users;

    } catch (err) {
        console.log("Error in find user service: ", err);
        throw err; // Re-throw so the controller can handle the response
    }
}

// send invite to group users
export async function sendInviteReq(receiverIds, senderId) {
    try {
        const targets = Array.isArray(receiverIds) ? receiverIds : [receiverIds];

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const sent = [];

        for (const targetId of targets) {
            // Check for Cooldown or Existing Pending Request
            const existingInvite = await Invitation.findOne({
                from: senderId,
                to: targetId,
                $or: [
                    { createdAt: { $gt: twentyFourHoursAgo } }, // Cooldown check
                    { status: 'pending' }                      
                ]
            });

            if (existingInvite) {
                continue;
            }

            const newInvite = new Invitation({
                from: senderId,
                to: targetId,
                status: 'pending'
            });

            await newInvite.save();
            sent.push(targetId);
        }

        return {
            success: true,
            details: sent
        };

    } catch (err) {
        console.error("Error in sendInviteReq service:", err);
        throw new Error("Failed to process invitation requests.");
    }
}

// send invite to single user
export async function sendSingleUserInvite(id) {
    
}