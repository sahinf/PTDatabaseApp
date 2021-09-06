<script lang="ts">
  import EditorActions from "./EditorActions.svelte";
  import EditorLists from "./EditorLists.svelte";
</script>

<div id="editor">
  <EditorActions />
  <EditorLists />
</div>

<style>
  #editor {
    display: flex;
    flex-direction: column;
  }

  :global(#action-bar) {
    flex-shrink: 0;
  }
</style>
