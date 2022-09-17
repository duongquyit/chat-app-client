import { socket } from '@plugins/socket';
import { auth, db } from '@config/firebase';
import { updateProfile } from '@firebase/auth';
import { collection, doc, getDocs, query, updateDoc, where } from '@firebase/firestore';
import currentUser from '@/composables/CurrentUser';

const messageRef = collection(db, 'messages');

const updateName = async (newName) => {
  try {
    await updateProfile(auth.currentUser, { displayName: newName });
    currentUser.displayName = newName;
    localStorage.setItem('auth', JSON.stringify(currentUser));
    // call function update database
    updateChageIntoDatabase('displayName', messageRef, currentUser.uid, newName);
    socket.emit('updateUserInformation', { fieldsName: 'displayName', data: newName });
  } catch (error) {
    console.log(error);
  }
}

const updatePhotoURL = async (newPhotoURL) => {
  try {
    const imageURL = newPhotoURL.replace('upload', `upload/${process.env.VUE_APP_CONFIG_IMAGE}`);
    await updateProfile(auth.currentUser, { photoURL: imageURL });
    currentUser.photoURL = newPhotoURL;
    localStorage.setItem('auth', JSON.stringify(currentUser));
    // call function update database
    updateChageIntoDatabase('photoURL', messageRef, currentUser.uid, imageURL);
    socket.emit('updateUserInformation', { fieldsName: 'photoURL', data: imageURL });
  } catch (error) {
    console.log(error);
  }
}

async function updateChageIntoDatabase(UPDATE_TYPE, reference, currentUserId, newValue) {
  try {
    const q = query(reference, where('sender.uid', '==', `${currentUserId}`))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (snapshot) => {
      const docRef = doc(db, 'messages', `${snapshot.id}`);
      if (UPDATE_TYPE == 'displayName') {
        await updateDoc(docRef, {
          'sender.displayName': newValue
        })
      } else if (UPDATE_TYPE == 'photoURL') {
        await updateDoc(docRef, {
          'sender.photoURL': newValue
        })
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export { updateName, updatePhotoURL }