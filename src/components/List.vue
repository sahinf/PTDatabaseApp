<template>
  <ul class="list">
    <li
      v-for="item in items"
      :key="item.id"
      @click="$emit('selectionChanged', item)">
      <slot :item="item">{{ item }}</slot>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    items: {
      type: Array,
      default: [] as any[],
    },
  },
  emits: {
    selectionChanged: null,
  },
});
</script>

<style scoped>
.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
