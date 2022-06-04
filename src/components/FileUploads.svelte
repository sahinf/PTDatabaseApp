<script lang="ts">
  import { Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import UploadButton from "./UploadButton.svelte";
  import Card from "./Card.svelte";
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
        })
        .finally( () => {
          snackbarText = "Sucessfullyed imported Peer Teacher/s!";
          snackbar.open();
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
        })
        .finally(() => {
          snackbarText = "Sucessfullyed imported Lab/s!";
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
        })
        .finally(() => {
          snackbarText = "Sucessfullyed imported database!";
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

<div class="flex flex-col items-center justify-center h-full ">
  <div class="flex grid grid-cols-2 gap-6">
    <Card
      title="Peer Teacher"
      desc="Upload one or more Peer Teacher schedule txt files"
    >
      <UploadButton
        accept="text/plain"
        multiple={true}
        bind:files={ptSchedules}
      />
    </Card>

    <Card
      title="Labs"
      desc="Upload one or more Labs as json file. Acquired from Howdy"
    >
      <UploadButton
        color="btn-success"
        accept="application/json"
        multiple={true}
        bind:files={labSchedule}
      />
    </Card>

    <Card
      title="Data Base"
      desc="Upload the json database file to continue working"
    >
      <UploadButton
        color="btn-info"
        accept="application/json"
        multiple={true}
        bind:files={dbFile}
      />
    </Card>

    <Card
      title="Export DB"
      desc="Download the json database file to save your work. Remember to save it on the cloud somewhere!"
    >
      <button class="btn btn-warning" on:click={exportDB}>Download</button>
    </Card>
  </div>
</div>

<!-- https://github.com/saadeghi/daisyui/issues/221 -->
<!-- Snackbar is a work in progress for Daisyui. Until then, keep smui -->
<Snackbar bind:this={snackbar} labelText={snackbarText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
