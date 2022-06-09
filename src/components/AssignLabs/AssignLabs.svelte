<script lang="ts">
  import type PeerTeacher from "../../models/PeerTeacher";
  import { labStore, ptStore } from "../../stores";
  import Lab from "./Lab.svelte";
  import PT from "./PT.svelte";
  import { onMount } from "svelte";
  import {
    parseDatabase,
    parseDatabaseLocal,
    parseLabSchedule,
  } from "../../util/parser";

  let selectedPeerTeacher: PeerTeacher | undefined;

  $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
    a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
  );

  $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);

  $: assignedLabs = [...(selectedPeerTeacher?.labs.values() ?? [])]
    .flatMap((labId) => {
      const lab = $labStore.get(labId);
      return lab === undefined ? [] : [lab];
    })
    .sort((a, b) => a.id - b.id);

  $: compatibleLabs = labs.filter(
    (lab) =>
      // Lab not already assigned
      !lab.assigned &&
      // PT schedule not conflict with lab
      !selectedPeerTeacher?.conflictsWith(lab.event) &&
      // PT's labs not conflict with this lab
      !assignedLabs.some((assignment) =>
        assignment.event.conflictsWith(lab.event)
      )
  );

  function deletePT(id: number) {
    if (selectedPeerTeacher?.id === id) {
      selectedPeerTeacher = undefined;
    }

    $ptStore.get(id)?.labs.forEach((lab_id) => {
      const lab = $labStore?.get(lab_id);
      if (lab !== undefined) lab.assigned = false;
    });

    ptStore.update((map) => {
      map.delete(id);
      return map;
    });

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
  }

  function assignLab(id: number) {
    // Mark lab as assigned
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = true;

    selectedPeerTeacher?.labs.add(id);

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
    // Self assignment to update PT values used in `Peer Teacher` column
    peerTeachers = peerTeachers;
  }

  function unassignLab(id: number) {
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = false;

    selectedPeerTeacher?.labs.delete(id);

    // Mark lab as unassigned

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
    // Self assignment to update PT values used in `Peer Teacher` column
    peerTeachers = peerTeachers;
  }

  $: clicked = 0;

  $: columns = [
    { header: "Peer Teachers", data: [...peerTeachers], component: PT },
    { header: "Labs", data: [...compatibleLabs], component: Lab },
    {
      header: selectedPeerTeacher?.name ?? "PT's Labs",
      data: [...assignedLabs],
      component: Lab,
    },
  ];

  // Load db from local storage so I don't have to keep uploading
  onMount(() => {
    const db = localStorage.getItem("db");
    if (db) {
      parseDatabaseLocal(JSON.parse(db));
    }
  });
</script>

<div class="flex flex-row h-full px-[10%] pt-[3%] pb-[10%]">
  <!-- 3 Columns -->

  <div class="assign-box rounded-l-xl">
    <div class="assign-box-header">Peer Teacher</div>
    <div class="assign-box-body">
      {#each peerTeachers as pt}
        <div
          class={selectedPeerTeacher == pt ? "border-l-8 border-blue-500" : ""}
          on:click={() => {
            selectedPeerTeacher = pt;
          }}
        >
          <svelte:component this={PT} {pt} />
        </div>
      {/each}
    </div>
  </div>

  <div class="assign-box">
    <div class="assign-box-header">Labs</div>
    <div class="assign-box-body">
      {#each labs as lab}
        <!-- <div> -->
        <svelte:component this={Lab} {lab} />
        <!-- </div> -->
      {/each}
    </div>
  </div>

  <div class="assign-box rounded-r-xl">
    <div class="assign-box-header">
      {selectedPeerTeacher?.name ?? "PT's Labs"}
    </div>
    <div class="assign-box-body">
      {#each assignedLabs as lab}
        <!-- <div> -->
        <svelte:component this={Lab} {lab} />
        <!-- </div> -->
      {/each}
    </div>
  </div>
</div>

<style>
  /* .assign-labs {
    display: flex;
    min-height: 0;
    max-width: 100vw;
    overflow: hidden;
    font-family: "Fira Code", sans-serif;
    border-radius: 2em 2em 2em 2em;
    margin-top: 1.5em;
  }

  .col-header {
    font-family: inherit;
    text-align: center;
    max-height: 1em;
    overflow: hidden;
    font-size: x-large;
    font-weight: 600;
    border: 0.1em solid rgb(6, 69, 48);
    border-radius: 20em 20em;
    margin: 0.3em 1em 0em 1em;
  }

  .column {
    display: flex row;
    font-family: inherit;
    flex: 1;

    background-color: rgb(192, 192, 164);
  }

  * :global(.editor-list) {
    margin: 0.5em 0em 0.5em 0.5em;
    font-family: inherit;
    font-weight: 600;
    height: 70vh;
    overflow: auto;
  } */
</style>
