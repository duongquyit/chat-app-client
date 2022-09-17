<template>
  <div
    class="user-profile-container"
    :class="{ borderDarkModeRight: isDarkMode }"
  >
    <div class="user-profile-avatar">
      <div class="profile-avatar">
        <img :src="currentUser?.photoURL" alt="" />
        <span @click="handleClickUpdateAvatar" class="update-avatar"
          ><i class="fa-solid fa-pencil"></i
        ></span>
      </div>
    </div>
    <div class="user-profile-information">
      <span v-if="!isEditName">
        {{ currentUser?.displayName }}&ensp;
        <span @click="handleClickChangeUpdateName"
          ><i class="fa-solid fa-pen-to-square"></i
        ></span>
      </span>
      <!-- form change name -->
      <form
        v-else
        class="edit-name-form"
        @submit.prevent="handleSubmitEditName"
      >
        <input type="text" v-model="newName" />
        <span @click="handleClickCancelEditName"
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
  props: {
    currentUser: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const newName = ref(props.currentUser.displayName);
    const isEditName = ref(false);

    const handleClickUpdateAvatar = () => {
      emit("showUploadImgae");
    };

    const handleClickChangeUpdateName = () => {
      isEditName.value = true;
    };

    const handleSubmitEditName = () => {
      emit("editName", newName.value);
      isEditName.value = false;
    };

    const handleClickCancelEditName = () => {
      isEditName.value = false;
    };

    return {
      newName,
      isEditName,
      isDarkMode,
      handleClickUpdateAvatar,
      handleClickChangeUpdateName,
      handleSubmitEditName,
      handleClickCancelEditName,
    };
  },
};
</script>

<style>
@import "@assets/style/user_profile.css";
</style>
