<script lang="ts">
  export let accept = "";
  export let multiple = false;
  export let files: FileList | null = null;
  export let color = "";
</script>

<label class="btn {color}">
  Upload
  <input type="file" {accept} {multiple} bind:files hidden />
</label>
