import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config/constant";
import { useUser } from "../context/UserContext";
import CreateGroupModal from "../components/CreateGroupModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { user: currentUser } = useUser();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { socket } = useUser();
  const navigate = useNavigate();

  // fetch gropus
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${URL}/api/chat/groups`, {
        withCredentials: true,
      });
      const fetchedGroups = res.data.groups || [];
      setGroups(fetchedGroups);

      // Join socket rooms
      if (socket && fetchedGroups.length > 0) {
        socket.emit(
          "joinGroups",
          fetchedGroups.map((g) => g._id),
        );
      }
    } catch (err) {
      console.error("Fetch groups error", err);
    }
  };

  // send mssg
  const handleSendMessage = () => {
    if (!socket || !text.trim() || !selectedGroup) {
      toast.error("Error in sending message");
      return;
    }
    console.log(text);
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      chatId: selectedGroup._id,
      text: text,
      isGroup: true,
    });
    setText("");
  };

  // fetch group messages
  const fetchMessages = async () => {
    if (!selectedGroup) return;
    try {
      const res = await axios.get(
        `${URL}/api/chat/group/messages/${selectedGroup._id}`,
        { withCredentials: true },
      );
      console.log(res);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages", err);
      toast.error("Could not load previous messages");
    }
  };
  useEffect(() => {
    fetchGroups();
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (msg) => {
      if (msg.chatId === selectedGroup?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("newMessage");
  }, [socket, selectedGroup]);

  useEffect(() => {
    fetchMessages();
  }, [selectedGroup]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Modal integration */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onGroupCreated={(newGroup) => setGroups([...groups, newGroup])}
        />
      )}

      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        <button 
            onClick={() => navigate(-1)} 
            className="text-sm text-gray-500 justify-self-start   m-2 font-medium hover:underline cursor-pointer"
        >
            Back To Chat
        </button>
        <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center">
          <span className="font-bold">Groups</span>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold cursor-pointer"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {groups.map((g) => (
            <div
              key={g._id}
              onClick={() => setSelectedGroup(g)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedGroup?._id === g._id ? "bg-blue-50 border-r-4 border-blue-600" : ""}`}
            >
              <h3 className="font-semibold text-gray-800">{g.groupName}</h3>
              <p className="text-xs text-gray-500">
                {g.participants?.length || 0} members
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="p-4 bg-white border-b font-bold shadow-sm">
              {selectedGroup.groupName}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-200 flex flex-col gap-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm flex flex-col ${
                    (m.senderId?._id || m.senderId) === currentUser._id
                      ? "bg-[#dcf8c6] self-end"
                      : "bg-white self-start"
                  }`}
                >
                  {(m.senderId?._id || m.senderId) !== currentUser._id && (
                    <p className="text-[10px] font-bold text-blue-600 mb-1">
                      {m.senderId?.username}
                    </p>
                  )}
                  <p className="text-gray-800 text-sm leading-tight pr-4">
                    {m.text}
                  </p>
                  <p className="text-[9px] text-gray-500 self-end mt-1 uppercase">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleString([], {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <input
                className="flex-1 p-2 border rounded focus:outline-none"
                placeholder="Message group..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a group to start conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
