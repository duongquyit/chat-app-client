import { ref } from "vue";

const debounceVal = ref(null);
const debounce = (time, callback) => {
  clearTimeout(debounceVal.value);
  debounceVal.value = setTimeout(() => {
    callback();
  }, time);
};

export default debounce;
