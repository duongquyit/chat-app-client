import axios from 'axios';
import { ref } from 'vue';

const isPending = ref(false);
const imgURL = "https://res.cloudinary.com/dqstetacw/image/upload";
const imgConfig = "w_100,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35";

const uploadImageToCloud = async (imageName) => {
  const formData = new FormData();
  formData.append('file', imageName);
  formData.append('upload_preset', `${process.env.VUE_APP_CLOUD_DINARY_PRESET}`);
  try {
    isPending.value = true;
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.VUE_APP_CLOUD_DINARY_NAME}/image/upload`, formData);
    const { secure_url, version, public_id, format } = res.data;
    return { secure_url, version, public_id, format };
  } catch (error) {
    console.log(error);
  } finally {
    isPending.value = false;
  }
}

export { uploadImageToCloud, isPending, imgURL, imgConfig }