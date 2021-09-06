<script lang="ts">
  import Button, { Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import FileUpload from "./FileUpload.svelte";
  import { parseLabScheduleFile, parsePTFile } from "../logic/EditorActions";
  import { labStore, ptStore } from "../stores";

  let ptSchedules: FileList | null;
  let labSchedule: FileList | null;
  let dbFile: FileList | null;
  let snackbar;
  let snackbarText;

  $: {
    if (ptSchedules?.length) {
      const promises = [...ptSchedules].map((file) => parsePTFile(file));
      Promise.allSettled(promises)
        .then((results) =>
          results.flatMap((result) => {
            if (result.status === "fulfilled") {
              ptStore.update((val) => val.set(result.value.id, result.value));
              return [];
            } else {
              return [result];
            }
          })
        )
        .then((failed) => {
          if (failed.length) {
            snackbarText = `Failed to add ${failed.length} PTs. See console for details.`;
            snackbar.open();
          }
        });
    }
  }

  $: {
    if (labSchedule?.length) {
      parseLabScheduleFile(labSchedule[0])
        .then((labs) => {
          labStore.update(() => new Map(labs.map((lab) => [lab.id, lab])));
        })
        .catch(() => {
          snackbarText =
            "Failed to import lab schedule. See console for details.";
          snackbar.open();
        });
    }
  }

  $: {
    if (dbFile?.length) console.log(dbFile);
  }

  function exportDB() {}
</script>

<div id="action-bar">
  <FileUpload accept="text/plain" multiple={true} bind:files={ptSchedules}>
    <Label>Add PT</Label>
  </FileUpload>
  <FileUpload accept="application/json" bind:files={labSchedule}>
    <Label>Import Labs</Label>
  </FileUpload>
  <FileUpload accept="application/json" bind:files={dbFile}>
    <Label>Import DB</Label>
  </FileUpload>
  <Button variant="raised" ripple={false} on:click={exportDB}>
    <Label>Export DB</Label>
  </Button>
</div>
<Snackbar bind:this={snackbar} labelText={snackbarText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  #action-bar {
    max-width: 100vw;
    overflow-x: auto;
    white-space: nowrap;
  }
</style>
