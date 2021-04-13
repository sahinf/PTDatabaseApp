<template>
  <router-view/>
</template>

<style>
*, *:before, *:after {
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  max-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
  }
}
</style>
