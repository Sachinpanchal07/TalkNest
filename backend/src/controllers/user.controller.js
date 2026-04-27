import {findUsersByQuery, sendInviteReq, sendSingleUserInvite, updateInviteStatus, getReceivedInvites} from "../services/user.service.js"

// Search User
export async function userSearchController(req, res, next) {
    try{
        console.log("In user serach constorler")
        const { query } = req.body;
        console.log(query, "query")
        if(!query){
            return res.status(400).json({message : "Search query is required"})
        }
        const users = await findUsersByQuery(query);
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
        // const senderId = req.user._id;
        const senderId = "69e9e097a403e62d33deed3c";

        if (!receivierId || (Array.isArray(receivierId) && receivierId.length === 0)) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }
        const result = await sendInviteReq(receivierId, senderId);
        console.log(result)

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
        throw Error(err.message);
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

// get invites for review
export async function getInvitesController(req, res) {
  try {
    const userId = req.user._id; // Get ID from userAuth middleware
    const invites = await getReceivedInvites(userId);

    res.status(200).json({
      success: true,
      data: invites
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}