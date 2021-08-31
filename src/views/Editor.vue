<template>
  <div id="editor">
    <ActionBar />
    <EditorLists :peerTeachers="peerTeachers" :labs="labs" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import EditorLists from '@/components/EditorLists.vue';
import Lab from '@/models/Lab';
import PeerTeacher from '@/models/PeerTeacher';

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
#editor {
  display: flex;
  flex-direction: column;
  max-height: inherit;
}

#action-bar {
  flex-shrink: 0;
}
</style>
