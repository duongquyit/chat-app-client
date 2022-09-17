import { reactive } from "vue";

const { 
  displayName, 
  photoURL,
  email, 
  phoneNumber, 
  uid } = JSON.parse(localStorage.getItem('auth'));

const currentUser = reactive({ displayName, photoURL, email, phoneNumber, uid });

export default currentUser;