<template>
  <label class="file-upload-lbl">
    <input
      type="file"
      :accept="accept"
      @change="$emit('fileChanged', $event.target.files)"
      :multiple="multiple" hidden />
    <slot>Upload</slot>
  </label>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    accept: String,
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    fileChanged: null,
  },
};
</script>

<style scoped>
.file-upload-lbl {
  background-color: #500000;
  color: white;
  padding: 0.5em;
  text-align: center;
}

.file-upload-lbl:hover {
  color: grey;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .file-upload-lbl {
    background-color: #81302b;
  }
}
</style>
