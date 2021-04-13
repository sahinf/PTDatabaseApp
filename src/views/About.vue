<template>
  <div class="about">
    <router-link to="/editor">Create new database</router-link>
    <file-upload
      :accept="'application/json'"
      @file-changed="handleDatabaseChange">Use existing database</file-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FileUpload from '../components/FileUpload.vue';

import { parsePtDatabase } from '../features/parser';

export default defineComponent({
  name: 'About',
  components: {
    FileUpload,
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
