<script lang="ts">
  import type PeerTeacher from "../../models/PeerTeacher";
  import { labStore, ptStore } from "../../stores";
  import Lab from "./LabBox.svelte";
  import PT from "./PTBox.svelte";
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

  $: unassignedLabs = labs.filter((lab) => !lab.assigned);

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
    if (lab === undefined) {
      console.error("Error lab does not exist");
      return;
    }
    lab.assigned = true;

    selectedPeerTeacher?.labs.add(id);

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
    // Self assignment to update PT values used in `Peer Teacher` column
    peerTeachers = peerTeachers;
  }

  function unassignLab(id: number) {
    console.log("unassiging", id)
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

  // Load db from local storage so I don't have to keep uploading
  onMount(() => {
    const db = localStorage.getItem("db");
    if (db) {
      parseDatabaseLocal(JSON.parse(db));
    }
  });
</script>

<div
  class="flex-none overflow-hidden flex-col h-[100vh] w-[80vw] px-[2vw] pt-[1vh]"
>
  <!-- Top half: 3 Columns -->
  <div class="flex flex-row h-[80vh]">
    <!-- PT Box -->
    <div class="assign-box rounded-l-xl">
      <!-- PT Header -->
      <div class="assign-box-header">Peer Teacher</div>
      <!-- PT Body -->
      <div class="assign-box-body">
        {#each peerTeachers as pt}
          <div
            class={selectedPeerTeacher == pt
              ? "border-l-8 border-blue-500"
              : ""}
            on:click={() => {
              selectedPeerTeacher = pt;
            }}
          >
            <svelte:component this={PT} {pt} />
          </div>
        {/each}
      </div>
    </div>

    <!-- Available Labs -->
    <div class="assign-box">
      <div class="assign-box-header">Labs</div>
      <div class="assign-box-body">
        {#each compatibleLabs as lab}
          <svelte:component this={Lab} {lab} iconClick={()=>{assignLab(lab.id)}} />
        {/each}
      </div>
    </div>

    <!-- Selected PT's Labs -->
    <div class="assign-box rounded-r-xl">
      <div class="assign-box-header">
        {selectedPeerTeacher?.name ?? "PT's Labs"}
      </div>
      <div class="assign-box-body">
        {#each assignedLabs as lab}
          <svelte:component this={Lab} {lab} icon="minus-circle" iconClick={()=>{unassignLab(lab.id)}} />
        {/each}
      </div>
    </div>
  </div>

  <!-- Bottom half: Universal unassigned labs -->
  <div
    class="flex flex-row overflow-auto mt-[1vh] border-y-4 border-slate-500 w-full h-[17vh] items-center text-sm"
  >
    {#each unassignedLabs as lab}
      <div
        class="border rounded-xl hover:bg-sky-100 hover:text-black px-3 py-1 mx-2"
      >
        <p>{lab.course}</p>
        <p>{lab.section}</p>
      </div>
    {/each}
  </div>
</div>
