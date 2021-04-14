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

<script>
export default {
  name: 'List',
  props: {
    items: Array,
  },
  emits: {
    selectionChanged: null,
  },
};
</script>

<style scoped>
.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
