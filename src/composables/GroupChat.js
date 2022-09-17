import { db } from "@/config/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { ref } from "vue";

const groupChatRef = collection(db, 'group-chat');
const createGroupChat = async ({ listUsers, creator, groupChatName, groupChatPhotoURL }) => {
  const listMembersUID = listUsers.map(user => user.uid);
  try {
    await addDoc(groupChatRef, {
      members: [creator, ...listUsers],
      creator: creator,
      groupChatName: groupChatName,
      groupChatPhotoURL: groupChatPhotoURL || 'https://png.pngtree.com/png-vector/20191130/ourlarge/pngtree-group-chat-icon-png-image_2054401.jpg',
      membersId: [creator.uid, ...listMembersUID],
      createdAt: new serverTimestamp(),
    })
  } catch (error) {
    console.log(error);
  }
}

const listGroupsChatOfCurrentUser = ref([]);
const getGroupsChatOfCurrentUser = (currentUserId) => {
  try {
    const q = query(groupChatRef, where('membersId', 'array-contains', `${currentUserId}`), orderBy('createdAt'));
    onSnapshot(q, (querySnapshot) => {
      listGroupsChatOfCurrentUser.value = querySnapshot.docs.map(doc => {
        return {
          groupChatId: doc.id,
          ...doc.data(),
        }
      })
    });
  } catch (error) {
    console.log(error);
  }
}

const updateGroupChat = async (group) => {
  try {
    const groupRef = doc(db, 'group-chat', group.groupChatId);
    await updateDoc(groupRef, {
      groupChatName: group.groupChatName,
      groupChatPhotoURL: group.groupChatPhotoURL,
      members: group.members,
      membersId: group.members.map(m => m.uid),
    })
  } catch (error) {
    console.log(error);
  }
}

// midset: + delete grop if leaver is creator
//         + delete group when only 1 member
//         + update user leave group chat
const leaveGroupChat = async (groupId, user) => {
  const groupRef = doc(db, 'group-chat', groupId);
  try {
    const group = await getDoc(groupRef);
    if (group.exists()) {
      if (group.data().creator.uid == user.uid) {
        await deleteDoc(groupRef);
      } else {
        const index = group.data().members.findIndex(({ uid }) => uid == user.uid);
        const amountMember = group.data().members.splice(index, 1).length;
        if (amountMember == 1) {
          await deleteDoc(groupRef);
        } else {
          await updateDoc(groupRef, {
            members: group.data().members.splice(index, 1),
            membersId: group.data().membersId.splice(index, 1),
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export {
  listGroupsChatOfCurrentUser,
  createGroupChat,
  getGroupsChatOfCurrentUser,
  updateGroupChat,
  leaveGroupChat,
}