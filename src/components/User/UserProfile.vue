<template>
  <div
    class="user-profile-container"
    :class="{ borderDarkModeRight: isDarkMode }"
  >
    <div class="user-profile-avatar">
      <div class="profile-avatar">
        <img :src="currentUser?.photoURL" alt="" />
        <span @click="$emit('showUploadImgae')" class="update-avatar"
          ><i class="fa-solid fa-pencil"></i
        ></span>
      </div>
    </div>
    <div class="user-profile-information">
      <span v-if="!isEditName">
        {{ currentUser?.displayName }}&ensp;
        <span @click="isEditName = true"
          ><i class="fa-solid fa-pen-to-square"></i
        ></span>
      </span>
      <!-- form change name -->
      <form
        v-else
        class="edit-name-form"
        @submit.prevent="$emit('editName', newName), (isEditName = false)"
      >
        <input type="text" v-model="newName" />
        <span @click="isEditName = false"
          ><i class="fa-solid fa-xmark"></i
        ></span>
      </form>
      <span>{{ currentUser?.email }}</span>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { isDarkMode } from "@composables/GlobalVariables";
export default {
  name: "UserProfile",
  props: ["currentUser"],
  setup(props) {
    const newName = ref(props.currentUser.displayName);
    const isEditName = ref(false);

    return { newName, isEditName, isDarkMode };
  },
};
</script>

<style>
@import '@assets/style/user_profile.css';
</style> 