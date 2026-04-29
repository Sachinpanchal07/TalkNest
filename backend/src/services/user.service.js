import User from "../models/user.model.js";
import Invitation from "../models/invitation.model.js";

// Search random Users
export async function findUsersByQuery(query) {
  try {
    const searchRegex = new RegExp(query, "i");

    const users = await User.find({
      $or: [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
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
          { status: "pending" },
        ],
      });

      if (existingInvite) {
        continue;
      }

      const newInvite = new Invitation({
        from: senderId,
        to: targetId,
        status: "pending",
      });

      await newInvite.save();
      sent.push(targetId);
    }

    return {
      success: true,
      details: sent,
    };
  } catch (err) {
    console.error("Error in sendInviteReq service:", err);
    throw new Error("Failed to process invitation requests.");
  }
}

// send invite to single user
export async function sendSingleUserInvite(senderId, receiverId) {
  try {
    // console.log("In sinle user invite service")
    const existingInvite = await Invitation.findOne({
      $or: [
        { from: senderId, to: receiverId },
        { to: receiverId, from: senderId },
      ],
    });

    if (existingInvite) {
      throw new Error("Invitation already exists or a connection is pending.");
    }

    const newInvitation = new Invitation({
      from: senderId,
      to: receiverId,
      status: "pending", 
    });

    const savedInvite = await newInvitation.save();

    return savedInvite;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

// update invite status (accept/reject)
export async function updateInviteStatus(requestId, status, userId) {
  try {
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status update");
    }

    // we ensure the person accepting is the receiver, not the sender!
    const invitation = await Invitation.findOne({
      _id: requestId,
      to: userId,
      status: "pending",
    });

    if (!invitation) {
      throw new Error("Invitation not found or already processed");
    }

    invitation.status = status;
    const result = await invitation.save();
    return result;
  } catch (err) {
    console.error("Error in updateInviteStatus service:", err);
    throw err;
  }
}

// Fetch invitations received by the current user
export async function getReceivedInvites(userId) {
  try {
    const invites = await Invitation.find({ to: userId })
      .populate("from", "username avatar") 
      .sort({ createdAt: -1 }); 

    return invites;
  } catch (err) {
    console.error("Error in getReceivedInvites service:", err);
    throw new Error("Could not fetch invitations");
  }
}

// fetch all user connections
export const getConnectedUsers = async (userId) => {
    // Find invites where current user is either 'from' or 'to' AND status is 'accepted'
    const connections = await Invitation.find({
        status: "accepted",
        $or: [{ from: userId }, { to: userId }]
    }).populate("from to", "username avatar isOnline");

    // Filter out the current user from the results
    console.log(connections);
    return connections.map(invite => {
        return invite.from._id.toString() === userId.toString() ? invite.to : invite.from;
    });
};

// sent invites fetch
export const getSentInvitesService = async (userId) => {
    try {
        const invites = await Invitation.find({ from: userId })
            .populate("to", "username avatar email") 
            .sort({ createdAt: -1 });

        return invites;
    } catch (error) {
        throw new Error("Error in fetching sent invites service: " + error.message);
    }
};