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
  let questionnaire_file: FileList | null;
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
    if (questionnaire_file?.length) {
      readQuestionnaire(questionnaire_file[0]);
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

<div class="flex grid m-10 grid-cols-2 gap-2 w-[70%] ">
  <Card title="Data Base" desc="">
    <UploadButton
      color="btn-info"
      accept="application/json"
      multiple={true}
      bind:files={dbFile}
    />
    <button class="btn btn-warning" on:click={exportDB}>Download</button>
    <button class="btn btn-ghost" on:click={exportDB2LocalStorage}
      >LocalStorage</button
    >
  </Card>

  <Card title="Peer Teachers" desc="">
    <label class="btn btn-info">
      Schedules
      <input type="file" accept="text/plain" bind:files={ptSchedules} hidden />
    </label>
    <label class="btn btn-secondary">
      Straw Poll
      <input
        type="file"
        accept="text/csv"
        bind:files={officehoursFiles}
        hidden
      />
    </label>
    <label class="btn btn-error">
      Questionnaire
      <input
        type="file"
        accept="text/csv"
        bind:files={questionnaire_file}
        hidden
      />
    </label>
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
</div>

<!-- https://github.com/saadeghi/daisyui/issues/221 -->
<!-- Snackbar is a work in progress for Daisyui. Until then, keep smui -->
<Snackbar bind:this={snackbar} labelText={snackbarText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
