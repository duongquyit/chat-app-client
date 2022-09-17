import { db } from "@/config/firebase"
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { ref } from "vue";

const notifRef = collection(db, 'notifications');

const addNotification = async ({ sender, receiver }) => {
  try {
    const q = query(
      notifRef,
      where('sender.uid', '==', `${sender?.uid}`),
      where('receiver.uid', '==', `${receiver?.uid}`)
    );
    const snapshot = await getDocs(q);
    // if notification exists -> update created at and seen status to unseen
    if (snapshot.docs[0]?.id) {
      const docRef = doc(db, 'notifications', `${snapshot.docs[0].id}`);
      await updateDoc(docRef, {
        createdAt: new serverTimestamp(),
        isSeen: false,
      });
      return;
    }
    // else add new notification
    await addDoc(notifRef, {
      createdAt: new serverTimestamp(),
      isSeen: false,
      receiver: {
        uid: receiver?.uid,
        displayName: receiver?.displayName,
        photoURL: receiver?.photoURL,
      },
      sender: {
        uid: sender?.uid,
        displayName: sender?.displayName,
        photoURL: sender?.photoURL,
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const listNotifications = ref([]);
const countUnseen = ref(0);
const getNoficationCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem('auth'));
  try {
    const q = query(
      notifRef,
      where('receiver.uid', '==', `${currentUser.uid}`),
      orderBy('createdAt', 'desc'),
      limit(10));
    onSnapshot(q, querySnapshot => {
      // get nitifications real time and document id
      listNotifications.value = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      const listNotificationsIsSeen = querySnapshot.docs.filter(doc => doc.data().isSeen == false);
      countUnseen.value = listNotificationsIsSeen.length;
    });
  } catch (error) {
    console.log(error);
  }
}

const updateSeenStatus = async (docId) => {
  const notificationRef = doc(db, 'notifications', `${docId}`);
  try {
    await updateDoc(notificationRef, {
      isSeen: true,
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  listNotifications,
  countUnseen,
  addNotification,
  getNoficationCurrentUser,
  updateSeenStatus
};