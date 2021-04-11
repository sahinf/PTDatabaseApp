<template>
  <ul class="list">
    <li
      v-for="item in items"
      :key="item.id"
      @click="$emit('selectionChanged', item)"
      class="list-item">
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
}

.list-item {
  border: 1px solid grey;
  border-radius: 5px;
  margin: 5px 0;
  padding: 0.15em;
  text-align: center;
}

.list-item:hover {
  background-color: rgb(182, 182, 182);
}
</style>
