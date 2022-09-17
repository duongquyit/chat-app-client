import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { ref } from 'vue';
import { auth } from '@config/firebase';

import router from '@router';

const errorMessage = ref("");
const isPending = ref(false);

const signup = async (email, password, name) => {
  try {
    isPending.value = true;
    errorMessage.value = '';
    const user = await createUserWithEmailAndPassword(auth, email, password);
    if (user) {
      await updateProfile(user.user, {
        displayName: name,
        photoURL: 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
      });
    }
    router.push('signin')
  } catch (error) {
    switch (error.code) {
      case 'auth/internal-error':
        errorMessage.value = 'Missing password';
        break;
      case 'auth/invalid-email':
        errorMessage.value = 'Email invalid';
        break;
      case 'auth/email-already-in-use':
        errorMessage.value = 'Email already in use';
        break;
    }
  } finally {
    isPending.value = false;
  }
}

export { signup, errorMessage, isPending }