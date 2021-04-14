<template>
  <button class="ui-button"><slot></slot></button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UIButton',
});
</script>

<style>
.ui-button {
  background-color: #500000;
  border: none;
  color: white;
  font-size: 1em;
  padding: 0.5em;
}

.ui-button:hover {
  color: grey;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .ui-button {
    background-color: #81302b;
  }
}
</style>
