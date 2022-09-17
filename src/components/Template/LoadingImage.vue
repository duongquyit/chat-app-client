<template>
  <div class="loading-upload-image-animation">
    <img
      src="https://res.cloudinary.com/dqstetacw/image/upload/v1656608009/loading-animation/esd0rd9k0czudbjcqjpa.gif"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: "LoadingImage",
};
</script>

<style>
.loading-upload-image-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
}

.loading-upload-image-animation img {
  margin-top: 7em;
}
</style>