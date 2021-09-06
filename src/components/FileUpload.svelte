<script lang="ts">
  export let accept = "";
  export let multiple = false;
  export let files: FileList | null = null;
</script>

<label class="mdc-button mdc-button--raised mdc-ripple-upgraded">
  <div class="mdc-button__ripple" />
  <slot>Upload</slot>
  <input type="file" {accept} {multiple} bind:files hidden />
</label>
