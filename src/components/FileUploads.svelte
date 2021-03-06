<script lang="ts">
  import { Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import UploadButton from "./helpers/UploadButton.svelte";
  import Card from "./helpers/Card.svelte";
  import {
    parseDatabaseFile,
    parseLabScheduleFile,
    parseOfficeHoursFile,
    parsePTFile,
    readQuestionnaire,
  } from "../logic/EditorActions";
  import { labStore, ptStore } from "../stores";

  let ptSchedules: FileList | null;
  let labSchedule: FileList | null;
  let dbFile: FileList | null;
  let questionairreFile: FileList | null;
  let officehoursFiles: FileList | null;
  let snackbar: Snackbar;
  let snackbarText;

  $: {
    if (ptSchedules?.length) {
      const promises = [...ptSchedules].map((file) => parsePTFile(file));
      Promise.allSettled(promises)
        .then((results) =>
          results.flatMap((result) => {
            if (result.status === "fulfilled") {
              // TODO uploading a new schedule to a PT just updates the previous value. This means that if we re-upload a PT that already exists (and who has labs assigned), then the new version of this PT will not have those labs (good), but all those labs will still be marked as assigned in `lab.assigned`. Maybe call a `pt.delete` function if the PT already exists when attempting to add.
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
        .finally(() => {
          snackbarText = "Successfully imported Peer Teacher/s!";
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
          snackbarText = "Successfully imported Lab/s!";
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
          snackbarText = "Successfully imported database!";
          snackbar.open();
        });
    }
  }

  $: {
    if (questionairreFile?.length) {
      readQuestionnaire(questionairreFile[0]);
    }
  }

  $: {
    if (officehoursFiles?.length) {
      parseOfficeHoursFile(officehoursFiles[0]);
    }
  }

  function dbStringify(): string {
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

    return dbObj;
  }

  function exportDB() {
    const dbObj = dbStringify();
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

  function exportDB2LocalStorage() {
    const db = dbStringify();
    localStorage.setItem("db", db);
  }
</script>

<div class="flex grid m-10 grid-cols-2 gap-2">
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

  <Card
    title="Export to Local Storage"
    desc="Save current DB to local storage. Local storage db should only be used for testing purposes to avoid data anomalies"
  >
    <button class="btn btn-warning" on:click={exportDB2LocalStorage}
      >LocalStorage</button
    >
  </Card>

  <Card
    title="Upload PTs from Questionnairre"
    desc="Gather all data from the questionnairre results. Should be in CSV format"
  >
    <UploadButton
      color="btn-info"
      accept="text/csv"
      multiple={false}
      bind:files={questionairreFile}
    />
  </Card>

  <Card
    title="Office Hours"
    desc="Upload the office hours output file for it to be parsed. Currently we accept a CSV file representation of a Strawpoll output"
  >
    <UploadButton
      color="btn-warn"
      accept="text/csv"
      multiple={false}
      bind:files={officehoursFiles}
    /></Card
  >
</div>

<!-- https://github.com/saadeghi/daisyui/issues/221 -->
<!-- Snackbar is a work in progress for Daisyui. Until then, keep smui -->
<Snackbar bind:this={snackbar} labelText={snackbarText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
