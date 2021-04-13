<template>
  <div id="start">
    <router-link to="/editor">
      <UIButton>Create new database</UIButton>
    </router-link>
    <FileUpload
      :accept="'application/json'"
      @fileChanged="handleDatabaseChange">Use existing database</FileUpload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FileUpload from '@/components/FileUpload.vue';
import { parsePtDatabase } from '@/features/parser';
import UIButton from '@/components/UIButton.vue';

export default defineComponent({
  name: 'Start',
  components: {
    FileUpload,
    UIButton,
  },
  methods: {
    handleDatabaseChange(files: File[]) {
      parsePtDatabase(files[0]).then((result) => {
        this.$store.commit('setLabs', result.labs);
        this.$store.commit('setPeerTeachers', result.peerTeachers);
        this.$router.push({ name: 'Editor' });
      });
    },
  },
});
</script>

<style>
#start {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  height: 100vh;
  justify-content: center;
}

#start > * {
  margin-top: 1em;
}

#start > *:first-child {
  margin-top: 0;
}
</style>
