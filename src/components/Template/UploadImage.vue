<template>
  <div class="upload-image-container">
    <div
      class="upload-image"
      :class="{ darkMode: isDarkMode, borderDarkMode: isDarkMode }"
    >
      <h3 class="upload-image-title">{{ $t("user.edit.uploadImageTitle") }}</h3>
      <div class="upload-image-form" :class="{ borderDarkMode: isDarkMode }">
        <input
          type="file"
          id="upload-image-input"
          @change="handleChangeInputFile"
        />
        <label
          for="upload-image-input"
          @dragstart.prevent=""
          @dragover.prevent=""
          @drop.prevent="handleDropImage"
        >
          <LoadingImage v-if="isPending" />
          <div class="upload-text" v-if="!imageURL">
            <span class="upload-icon"><i class="fa-solid fa-upload"></i></span>
            <span class="upload-text">{{
              $t("user.edit.uploadImageMessage")
            }}</span>
          </div>
          <img class="upload-image-before-save" v-else :src="imageURL" alt="" />
        </label>
      </div>
      <button @click="handleClickSaveBtn" class="save-btn">
        {{ $t("user.edit.save") }}
      </button>
      <button @click="handleClickCancelBtn" class="cancel-btn">
        {{ $t("user.edit.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import { isPending } from "@composables/UploadImage";
import { isDarkMode } from "@composables/GlobalVariables";

import LoadingImage from "@components/Template/LoadingImage.vue";
export default {
  name: "UploadImage",
  props: ["imageURL"],
  components: {
    LoadingImage,
  },
  setup(props, { emit }) {
    const handleChangeInputFile = (evt) => {
      emit("uploadImage", evt);
    };

    const handleDropImage = (evt) => {
      emit("dropImage", evt);
    };

    const handleClickSaveBtn = () => {
      emit("save");
    };

    const handleClickCancelBtn = () => {
      emit("cancel");
    };
    return {
      isPending,
      isDarkMode,
      handleChangeInputFile,
      handleDropImage,
      handleClickSaveBtn,
      handleClickCancelBtn,
    };
  },
};
</script>

<style>
@import "@assets/style/upload_image.css";
</style>