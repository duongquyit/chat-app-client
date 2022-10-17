import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { ref } from "vue";

const seenStatus = ref(new Map());
const getAllSeenStatusInRoom = async (roomId) => {
  const docRef = collection(db, "seen-status", "rooms", roomId);
  try {
    onSnapshot(docRef, (querySnapshot) => {
      const listSeenStatus = [];
      querySnapshot.forEach((doc) => {
        listSeenStatus.push(doc.data());
      });
      seenStatus.value.set(roomId, [...listSeenStatus]);
    });
  } catch (error) {
    console.log(error);
  }
};

const addSeenStatus = async (docRef, data) => {
  try {
    await addDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
};

const updateSeenStatus = async (docRef, data) => {
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
};

const handleSeenStatus = async (roomId, user, messageId) => {
  const seenStatusRef = collection(db, "seen-status", "rooms", roomId);
  const q = query(seenStatusRef, where("user.uid", "==", user.uid), limit(1));
  const docRef = await getDocs(q);
  if (docRef.empty && messageId) {
    await addSeenStatus(seenStatusRef, {
      user,
      messageId,
      createdAt: new serverTimestamp(),
    });
    return;
  }
  docRef.forEach(async (document) => {
    const docRef = doc(db, "seen-status", "rooms", roomId, document.id);
    if (document.data().messageId != messageId && messageId) {
      await updateSeenStatus(docRef, {
        messageId,
        updatedAt: new serverTimestamp(),
      });
    }
  });
};

export { seenStatus, handleSeenStatus, getAllSeenStatusInRoom };
