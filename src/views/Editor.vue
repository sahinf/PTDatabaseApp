<template>
  <div id="home">
    <action-bar />
    <editor-lists :peerTeachers="peerTeachers" :labs="labs" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import EditorLists from '@/components/EditorLists.vue';
import PeerTeacher from '@/models/PeerTeacher';
import Lab from '@/models/Lab';

export default defineComponent({
  name: 'Editor',
  components: {
    ActionBar,
    EditorLists,
  },
  computed: {
    labs(): Lab[] {
      return Array.from(this.$store.state.labs.values()).sort((a, b) => a.id
        .localeCompare(b.id));
    },
    peerTeachers(): PeerTeacher[] {
      return Array.from(this.$store.state.peerTeachers.values()).sort((a, b) => a.lastname
        .toUpperCase().localeCompare(b.lastname.toUpperCase()));
    },
  },
});
</script>

<style>
#home {
  max-height: inherit;
}
</style>
