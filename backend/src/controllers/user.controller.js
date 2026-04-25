import {findUsersByQuery, sendInviteReq, sendSingleUserInvite} from "../services/user.service.js"

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

export async function singleUserInviteController(){
    try{
        const {searchUserId} = req.body();
        if(!searchUserId){
            throw Error("serach user id not defined, try again!")
        }
        const res = await sendSingleUserInvite(searchUserId);
        console.logI(searchUserId);
    }catch(err){
        console.log("Error in invite controller:", err)
        throw Error(err.message);
    }

}