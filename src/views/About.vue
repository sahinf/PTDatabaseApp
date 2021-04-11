<template>
  <div class="about">
    <router-link to="/editor">Create new database</router-link>
    <file-upload
      :accept="'application/json'"
      @file-changed="handleDatabaseChange">Use existing database</file-upload>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue';

import { parsePtDatabase } from '../features/parser';

export default {
  name: 'About',
  components: {
    FileUpload,
  },
  methods: {
    handleDatabaseChange(files) {
      parsePtDatabase(files[0]).then((result) => {
        this.$store.commit('setLabs', result.labs);
        this.$store.commit('setPeerTeachers', result.peerTeachers);
        this.$router.push({ name: 'Editor' });
      });
    },
  },
};
</script>
