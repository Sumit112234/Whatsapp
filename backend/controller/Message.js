import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { getReceiverSocketId, io } from "../index.js";


export const sendMessage = async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const { id: receiverId } = req.params;

    console.log(message, receiverId, senderId);

    // Find or create a conversation between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // Add the message to the conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Update sender and receiver
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (receiver) {
      // Update receiver's unreadMessages array
      const unreadIndex = receiver.unreadMessages.findIndex(
        (entry) => entry.userId.toString() === senderId
      );

      if (unreadIndex > -1) {
        // Increment totalMessages if senderId exists
        receiver.unreadMessages[unreadIndex].totalMessages += 1;
      } else {
        // Add a new entry if senderId doesn't exist
        receiver.unreadMessages.push({ userId: senderId, totalMessages: 1 });
      }

      // Update receiver's lastMessage array
      const lastMessageIndex = receiver.lastMessage.findIndex(
        (entry) => entry.userId.toString() === senderId
      );

      if (lastMessageIndex > -1) {
        receiver.lastMessage[lastMessageIndex].message = message;
      } else {
        receiver.lastMessage.push({ userId: senderId, message });
      }
    }

    if (sender) {
      // Update sender's lastMessage array
      const lastMessageIndex = sender.lastMessage.findIndex(
        (entry) => entry.userId.toString() === receiverId
      );

      if (lastMessageIndex > -1) {
        sender.lastMessage[lastMessageIndex].message = message;
      } else {
        sender.lastMessage.push({ userId: receiverId, message });
      }
    }

    // Save all changes in parallel
    await Promise.all([
      conversation.save(),
      newMessage.save(),
      receiver?.save(),
      sender?.save(),
    ]);

    // Send real-time message via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ status: "success", newMessage, sender, receiver });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    console.log(senderId, req.user._id, userToChatId);

    // Find the conversation between the sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    // Update all messages in this conversation to `read: true` where applicable
    const updatedMessages = await Promise.all(
      conversation.messages.map(async (msg) => {
        if (!msg.read && msg.receiverId.toString() === senderId.toString()) {
          msg.read = true;
          await msg.save();
        }
        return msg;
      })
    );

    // Reset unreadMessages for the sender
    const sender = await User.findById(senderId);
    if (sender) {
      const unreadIndex = sender.unreadMessages.findIndex(
        (entry) => entry.userId.toString() === userToChatId
      );

      if (unreadIndex !== -1) {
        // Remove the unreadMessages entry for the current userToChatId
        sender.unreadMessages.splice(unreadIndex, 1);
      }

      await sender.save();
    }

    res.status(200).json({ success: true, messages: updatedMessages, sender });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




// import Conversation from "../models/conversation.js";
// import Message from "../models/message.js";
// import User from "../models/user.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";

// export const sendMessage = async (req, res) => {
// 	try {
// 		const { message, senderId } = req.body;
// 		const { id: receiverId } = req.params;
		
		
// 		console.log(message, receiverId, senderId);
		
// 		let conversation = await Conversation.findOne({
// 			participants: { $all: [senderId, receiverId] },
// 		});

// 		if (!conversation) {
// 			conversation = await Conversation.create({
// 				participants: [senderId, receiverId],
// 			});
// 		}

// 		const newMessage = new Message({
// 			senderId,
// 			receiverId,
// 			message,
// 		});

// 		if (newMessage) {
// 			conversation.messages.push(newMessage._id);
// 		}

// 		const receiver = await User.findOne({_id : receiverId});
// 		const sender = await User.findOne({_id : senderId});

// 		if(receiver)
// 		{
// 			receiver.lastMessage = message;
// 			receiver.unreadMessages += 1;
// 		}
		

		
		
// 		sender.lastMessage = message;
		
		



// 		// this will run in parallel
// 		await Promise.all([conversation.save(), newMessage.save() , receiver?.save(), sender?.save()]);

// 		// // SOCKET IO FUNCTIONALITY WILL GO HERE
// 		const receiverSocketId = getReceiverSocketId(receiverId);
// 		if (receiverSocketId) {
// 			// io.to(<socket_id>).emit() used to send events to specific client
// 			io.to(receiverSocketId).emit("newMessage", newMessage);
// 		}

// 		res.status(201).json({status : "success", newMessage, sender,receiver});
// 	} catch (error) {
// 		console.log("Error in sendMessage controller: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// export const getMessages = async (req, res) => {
	
// 	try {
// 		const { id: userToChatId } = req.params;
// 		 const senderId = req.user._id;
// 		console.log(senderId, req.user._id, userToChatId);

// 		const conversation = await Conversation.findOne({
// 			participants: { $all: [senderId, userToChatId] },
// 		}).populate("messages"); 

// 		if (!conversation) return res.status(200).json({ success : true, messages : []});

// 		const messages = conversation.messages;

// 		const sender = await User.findOne({_id : senderId});
		
// 		// console.log(sender)

// 		// sender.unreadMessages = 0;
// 		// await sender?.save();

// 		res.status(200).json({ success : true, messages, sender});
// 	} catch (error) {
// 		console.log("Error in getMessages controller: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };