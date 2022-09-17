<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}

:root {
  --border-color: #0000003d;
  --border-color-darkmode: #9191913d;
}

.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  padding: 0 .5em;
  justify-content: center;
  transition: background .5s linear;
}

.darkMode {
  background: #303030 !important;
  color: #a0a0a0 !important;
}

.borderDarkModeLeft {
  border-left: 1px solid var(--border-color-darkmode) !important;
}

.borderDarkModeRight {
  border-right: 1px solid var(--border-color-darkmode) !important;
}

.borderDarkModeBottom {
  border-bottom: 1px solid var(--border-color-darkmode) !important;
}

.borderDarkModeTop {
  border-top: 1px solid var(--border-color-darkmode) !important;
}

.borderDarkMode {
  border: 1px solid var(--border-color-darkmode) !important;
}

/* scrollbar css */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.055);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.123);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.322);
}

::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.548);
}
</style>
