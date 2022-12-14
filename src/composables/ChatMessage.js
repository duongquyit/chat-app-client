import { socket } from "@/plugins/socket";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref } from "vue";
import { db } from "@config/firebase";

// type message key
const PUBLIC_KEY = "PUBLIC";
const GROUP_KEY = "GROUP";
const PRIVATE_KEY = "PRIVATE";
const LIMIT_MESSAGE = 50;

const publicMessageKey = "public-messages";
const messages = ref(new Map());
const lastMessageId = ref("");

const handleGetMessages = async (messages, ROOM_KEY, callback) => {
  try {
    if (!messages.has(ROOM_KEY)) {
      if (ROOM_KEY === publicMessageKey) {
        await callback();
        return;
      }
      await callback(ROOM_KEY);
    }
  } catch (error) {
    console.log(error);
  }
};

const messagesResult = (listMessages) => {
  lastMessageId.value = listMessages.length ? listMessages[0].messageId : null;
  listMessages.reverse();
  const messageItem = {
    sender: {},
    messages: [],
  };
  const result = [];
  listMessages.forEach((item) => {
    const { sender } = item;
    const data = {
      chatType: item.chatType,
      messageId: item.messageId,
      message: item.message,
      reaction: item.reaction,
      isPublicMessage: item.isPublicMessage,
      isRemoved: item.isRemoved,
      createdAt: item.createdAt,
      ...(item.chatPrivateId && { chatPrivateId: item.chatPrivateId }),
    };
    if (!messageItem.sender.uid) {
      messageItem.sender = { ...sender };
      messageItem.messages.push(data);
    } else {
      if (messageItem.sender.uid == sender.uid) {
        messageItem.messages.push(data);
      } else {
        result.push({ ...messageItem });
        messageItem.sender = { ...sender };
        messageItem.messages = [];
        messageItem.messages.push(data);
      }
    }
  });
  result.push({ ...messageItem });
  return result;
};

const handleLoadMessages = (query, roomKey, CHAT_KEY) => {
  if (messageUnsubscrice.has(roomKey)) {
    messageUnsubscrice.get(roomKey)();
  }
  // handle get realtime message
  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    // store message real time
    const messageData = querySnapshot.docs.map((item) => {
      return {
        ...item.data(),
        messageId: item.id,
        chatType: CHAT_KEY,
        ...(CHAT_KEY === PRIVATE_KEY && { chatPrivateId: roomKey }),
      };
    });
    messages.value.set(roomKey, {
      lastMessage: messageData[0],
      messages: messagesResult(messageData),
      amountMessages: messageData.length,
    });
  });
  messageUnsubscrice.set(roomKey, unsubscribe);
};

// PUBLIC CHAT
// collection for public message
const messagesRef = collection(db, "messages");
const createPublicChatMessage = async (message, sender) => {
  try {
    await addDoc(messagesRef, {
      message: message,
      createdAt: new serverTimestamp(),
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL,
      },
      isPublicMessage: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const messageUnsubscrice = new Map();
const getPublicChatMessage = (limitCount = 1) => {
  try {
    // query get message sort by created at and limit 50 message
    const q = query(
      messagesRef,
      where("isPublicMessage", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT_MESSAGE * limitCount)
    );
    handleLoadMessages(q, publicMessageKey, PUBLIC_KEY);
  } catch (error) {
    console.log(error);
  }
};

// GROUP CHAT MESSAGE
const getGroupChatMessage = (groupChatId, limitCount = 1) => {
  try {
    const q = query(
      messagesRef,
      where("groupChatId", "==", `${groupChatId}`),
      orderBy("createdAt", "desc"),
      limit(LIMIT_MESSAGE * limitCount)
    );
    handleLoadMessages(q, groupChatId, GROUP_KEY);
  } catch (error) {
    console.log(error);
  }
};

const createGroupChatMessage = async (groupChatId, message, sender) => {
  try {
    await addDoc(messagesRef, {
      groupChatId,
      message,
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL,
      },
      createdAt: new serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

// PRIVATE CHAT
// create new collection for private message
const createPrivateChatMessage = async (message, sender, receiver) => {
  // MIDSET
  // room will create with name 'room-userOneId-userTwoId'
  // when sender send first message room is create
  // after receiver receive message and click will just join in room sender created
  const privateMessagesRef = collection(
    db,
    "private-messages",
    "rooms",
    `room-${sender.uid}-${receiver.uid}`
  );
  try {
    // get current room chat
    const snapshot = await getDocs(privateMessagesRef);
    // if room empty -> rotate position of userId
    if (snapshot.empty) {
      privateMessagesRef._path.segments[2] = `room-${receiver.uid}-${sender.uid}`;
    }
    await addDoc(privateMessagesRef, {
      message: message,
      createdAt: new serverTimestamp(),
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL,
      },
      receiver: {
        uid: receiver?.uid,
        displayName: receiver?.displayName,
        photoURL: receiver?.photoURL,
      },
    });
    socket.emit("notificationReceiveMessage", { sender, receiver });
  } catch (error) {
    console.log(error);
  }
};

// get private chat
const getPrivateChatMessage = async (chatPrivateId, limitCount = 1) => {
  try {
    const privateMessagesRef = collection(
      db,
      "private-messages",
      "rooms",
      `${chatPrivateId}`
    );
    const q = query(
      privateMessagesRef,
      orderBy("createdAt", "desc"),
      limit(LIMIT_MESSAGE * limitCount)
    );
    handleLoadMessages(q, chatPrivateId, PRIVATE_KEY);
  } catch (error) {
    console.log(error);
  }
};

const getPrivateChatId = async (userOneId, userTwoId) => {
  try {
    const privateMessagesRef = collection(
      db,
      "private-messages",
      "rooms",
      `room-${userOneId}-${userTwoId}`
    );
    const snapshot = await getDocs(privateMessagesRef);
    if (snapshot.empty) {
      privateMessagesRef._path.segments[2] = `room-${userTwoId}-${userOneId}`;
    }
    const chatPrivate = privateMessagesRef._path.segments[2];
    return chatPrivate;
  } catch (error) {
    console.log(error);
  }
};

// function handle message reaction
const handleMessageReaction = async (
  docRef,
  { iconReaction, userReaction }
) => {
  const doc = await getDoc(docRef);
  if (!doc.data().reaction?.length) {
    await updateDoc(docRef, {
      reaction: [
        {
          icon: iconReaction,
          user: userReaction,
        },
      ],
    });
    return;
  }
  // index of reaction into message
  const index = doc
    .data()
    .reaction.findIndex(({ user }) => user.uid == userReaction.uid);
  if (index != -1) {
    const { icon } = doc.data().reaction[index];
    const updateData = [...doc.data().reaction];
    // remove icon if icon like current icon reaction
    if (icon == iconReaction) {
      updateData.splice(index, 1);
      await updateDoc(docRef, {
        reaction: updateData,
      });
      return;
    }
    // change icon
    updateData[index].icon = iconReaction;
    await updateDoc(docRef, {
      reaction: updateData,
    });
    return;
  }
  // add reaction when user not exist in reaction list
  await updateDoc(docRef, {
    reaction: [
      ...doc.data().reaction,
      {
        icon: iconReaction,
        user: userReaction,
      },
    ],
  });
};

const messageReaction = async ({
  chatType,
  messageId,
  iconReaction,
  userReaction,
  chatPrivateId,
}) => {
  if (chatType == PUBLIC_KEY || chatType == GROUP_KEY) {
    const messageDocRef = doc(db, "messages", messageId);
    try {
      await handleMessageReaction(messageDocRef, {
        iconReaction,
        userReaction,
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }
  const messageDocRef = doc(
    db,
    "private-messages",
    "rooms",
    chatPrivateId,
    messageId
  );
  try {
    await handleMessageReaction(messageDocRef, { iconReaction, userReaction });
  } catch (error) {
    console.log(error);
  }
};

const initChatMessage = async (id, currentUserId) => {
  try {
    const groupRef = doc(db, "group-chat", id);
    const group = await getDoc(groupRef);
    if (group.exists()) {
      return {
        name: group.data().groupChatName,
        photoURL: group.data().groupChatPhotoURL,
        isGroupChat: true,
      };
    }
    const userRef = collection(db, "users");
    const privateChatRoom = await getPrivateChatId(currentUserId, id);
    const q = query(userRef, where("uid", "==", id), limit(1));
    const users = await getDocs(q);
    const data = {};
    users.forEach((user) => {
      data.name = user.data().displayName;
      data.photoURL = user.data().photoURL;
      data.user = {
        displayName: user.data().displayName,
        photoURL: user.data().photoURL,
        uid: user.data().uid,
      };
      data.privateChatRoomId = privateChatRoom;
      data.isGroupChat = false;
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const removeMessage = async (
  currentUserId,
  { chatType, messageId, chatPrivateId, senderId }
) => {
  console.log(messageId);
  try {
    if (currentUserId !== senderId) return;
    if (chatType === PUBLIC_KEY || chatType === GROUP_KEY) {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        isRemoved: true,
      });
      return;
    }
    const messageRef = doc(
      db,
      "private-messages",
      "rooms",
      chatPrivateId,
      messageId
    );
    await updateDoc(messageRef, {
      isRemoved: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  messages,
  lastMessageId,
  LIMIT_MESSAGE,
  handleGetMessages,
  initChatMessage,
  createPublicChatMessage,
  getPublicChatMessage,
  createPrivateChatMessage,
  getPrivateChatMessage,
  getGroupChatMessage,
  createGroupChatMessage,
  getPrivateChatId,
  messageReaction,
  removeMessage,
};
