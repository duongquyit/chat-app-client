import { createApp } from 'vue'
import App from './App.vue'
import router from '@router'
import store from './store'
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import i18n from '@plugins/i18n';
// Import the CSS or use your own!
library.add(fas, fab, far)
dom.watch();


createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(Toast)
  .component('font-awesome-icon', FontAwesomeIcon).mount('#app')
