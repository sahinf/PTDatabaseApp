<template>
  <div id="action-bar">
    <FileUpload
      :accept="'text/plain'"
      :multiple="true"
      @fileChanged="handlePtChange">Upload PT Schedule</FileUpload>
    <FileUpload
      :accept="'application/json'"
      @fileChanged="handleLabChange">Import Lab Schedule</FileUpload>
      <UIButton @click="save">Export</UIButton>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';
import { parseLabFile, parsePtSchedule } from '@/features/parser';
import UIButton from '@/components/UIButton.vue';

export default {
  name: 'ActionBar',
  components: {
    FileUpload,
    UIButton,
  },
  methods: {
    handleLabChange(files) {
      parseLabFile(files[0])
        .then((data) => {
          this.$store.commit('importLabs', data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handlePtChange(files) {
      const result = [];
      const promises = [];

      files.forEach((file) => {
        const p = parsePtSchedule(file).then((data) => result.push(data));
        promises.push(p);
      });

      Promise.all(promises)
        .then(() => {
          this.$store.commit('addPeerTeachers', result);
        });
    },
    save() {
      const database = {
        labs: Object.fromEntries(this.$store.state.labs),
        peerTeachers: Object.fromEntries(this.$store.state.peerTeachers),
      };

      const jsonObj = JSON.stringify(database, (_, value) => {
        if (typeof value === 'object' && value instanceof Set) {
          return [...value];
        }
        return value;
      });

      const blob = new Blob([jsonObj], { type: 'text/json' });
      const anchor = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = 'pt-db.json';
      anchor.style = 'display: none';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
#action-bar {
  max-width: 100vw;
  overflow-x: auto;
  white-space: nowrap;
}

#action-bar > * {
  margin-left: 0.5rem;
}

#action-bar > *:first-child {
  margin-left: 0;
}
</style>
