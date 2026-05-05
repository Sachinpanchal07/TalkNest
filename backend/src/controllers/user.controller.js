import {findUsersByQuery, sendInviteReq, sendSingleUserInvite, updateInviteStatus, getReceivedInvites, getConnectedUsers, getSentInvitesService, getSentInvitationsService} from "../services/user.service.js"

// Search User
export async function userSearchController(req, res, next) {
    try{
        // console.log("In user serach constorler")
        const { query } = req.body;
        console.log("query comming from clint, in user search controller", query);
        const userId = req.user._id;
        // console.log(query, "query")
        if(!query){
            return res.status(400).json({message : "Search query is required"})
        }
        const users = await findUsersByQuery(query, userId);
        res.status(200).json({users})

    }catch(err){
        res.status(500).json({"message" : "Error in finding User"});
    }
}

// invite group users
export async function usersInviteController(req, res, next) {
    try {
        const { receivierId } = req.body; 
        console.log(receivierId, receivierId.length)
        const senderId = req.user._id;
        // const senderId = "69e9e097a403e62d33deed3c";

        if (!receivierId || (Array.isArray(receivierId) && receivierId.length === 0)) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }
        const result = await sendInviteReq(receivierId, senderId);
        // console.log(result)

        if (result.details.length === 0) {
            return res.status(403).json({ 
                message: "Invite failed: Wait for 24h or req is pending!"
            });
        }

        res.status(200).json({
            message: "Request successful"
        });

    } catch (err) {
        console.error("Error in userInviteController:", err);
        res.status(500).json({ "message": "Internal Server Error", "error": err.message });
    }
}

// invite single user
export async function singleUserInviteController(req, res, next){
    try{
        const {searchUserId} = req.body;
        if(!searchUserId){
            throw Error("serach user id not defined, try again!")
        }
        const senderId = req.user._id;
        const result = await sendSingleUserInvite(senderId, searchUserId);

        // console.log(result);
        res.status(200).json({"message":"Invite sent successfully", "success" : "true"});
    }catch(err){
        console.log("Error in invite controller:", err)
        res.status(400).json({"success" : "false", "message" : err.message});
        // throw Error(err.message);
    }
}

// Review Invite (Accept/Reject)
export async function reviewInviteController(req, res) {
  try {
    const { requestId, status } = req.body;
    const userId = req.user._id; // Logged in user (the one who received the invite)

    if (!requestId || !status) {
      return res.status(400).json({ message: "Request ID and Status are required" });
    }

    const result = await updateInviteStatus(requestId, status, userId);

    res.status(200).json({
      message: `Invitation ${status} successfully`,
      data: result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// get received invites for review
export async function getInvitesController(req, res) {
  try {
    const userId = req.user._id; 
    const invites = await getReceivedInvites(userId);

    res.status(200).json({
      success: true,
      data: invites
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// get user connections
export async function getConnectionsController(req, res){
    try{
        const userId = req.user._id;
        const connections = await getConnectedUsers(userId);
        res.status(200).json({connections});
    }catch(err){
        console.log(err)
        throw new Error(err);
    }
}

// invite sent
export async function sentInvitesController(req, res) {
    try {
        // req.user.id comes from your protect/auth middleware
        const userId = req.user.id; 

        const invitations = await getSentInvitesService(userId);

        return res.status(200).json({
            success: true,
            count: invitations.length,
            invitations
        });
    } catch (error) {
        console.error("Sent Invites Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sent invitations"
        });
    }
}

// get all invitations
export const getAllInvitations = async (req, res) => {
    try {
        const userId = req.user._id; 
        const invitations = await getSentInvitationsService(userId);
        
        const invitedUserIds = invitations.map(inv => inv.to.toString());
        
        res.status(200).json({
            success: true,
            invitedUserIds
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch invitations" });
    }
};

// serach in connections to add in group
