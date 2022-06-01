<script lang="ts">
  import Button, { Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import FileUpload from "./FileUpload.svelte";
  import {
    parseDatabaseFile,
    parseLabScheduleFile,
    parsePTFile,
  } from "../logic/EditorActions";
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
    if (dbFile?.length) {
      parseDatabaseFile(dbFile[0])
        .then((database) => {
          labStore.set(database.labs);
          ptStore.set(database.peerTeachers);
        })
        .catch(() => {
          snackbarText = "Failed to import database. See console for details.";
          snackbar.open();
        });
    }
  }

  function exportDB() {
    const peerTeachers = [...$ptStore.values()];
    const labs = [...$labStore.values()];
    const database = {
      labs: labs,
      peerTeachers: peerTeachers,
    };

    const dbObj = JSON.stringify(database, (_, value) => {
      // Need to manually convert the PeerTeacher objects'
      // `labs` set to an array because `JSON.stringify` doesn't
      // support "stringing" it out of the box
      if (typeof value === "object" && value instanceof Set) {
        return [...value];
      }
      return value;
    });

    const blob = new Blob([dbObj], { type: "text/json" });
    const anchor = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = "pt-db.json";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
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
  <Button
    variant="raised"
    ripple={false}
    on:click={exportDB}
    style="overflow: hidden; margin-left: 0.1em; margin-right: 0.5em;"
  >
    <Label>Export DB</Label>
  </Button>
  <div id="info" />
</div>
<Snackbar bind:this={snackbar} labelText={snackbarText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>

  #action-bar {
    display: flex;
    justify-content: space-evenly;
    align-content: center;
    border-radius: 1em;
    /* background-image: linear-gradient(to right, red, purple); */
    background-size: 100vw;
    max-height: 2em;
    max-width: 100vw;
    overflow: hidden;
    padding: 0.6em;
  }
</style>
