<template>
  <div class="loading-page">
    <img
      src="https://res.cloudinary.com/dqstetacw/image/upload/v1656655422/loading-animation/kj4qnzbhfjlvmyyvz3uz.gif"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: "TheLoading",
};
</script>

<style>
.loading-page {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: white;
  z-index: 100;
}

.loading-page img {
  margin-top: 15em;
  width: 5em;
}
</style>