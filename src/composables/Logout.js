import { socket } from '@/plugins/socket';
import { signOut } from 'firebase/auth';
import { ref } from 'vue';
import { auth } from '@config/firebase';

import router from '@router';

const isPending = ref(false);

const logout = async () => {
  try {
    isPending.value = true;
    await signOut(auth);
    socket.disconnect();
    localStorage.removeItem('auth');
    router.push('signin');
  } catch (error) {
    console.log(error);
  } finally {
    isPending.value = false;
  }
}

export { logout }