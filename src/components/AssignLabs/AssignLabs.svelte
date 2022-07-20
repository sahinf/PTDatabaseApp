<script lang="ts">
  import type PeerTeacher from "../../models/PeerTeacher";
  import type Lab from "../../models/Lab";
  import { labStore, ptStore } from "../../stores";
  import LabBox from "./LabBox.svelte";
  import PT from "./PTBox.svelte";

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

  $: compatibleLabs = labs.filter((lab) => {
    if (selectedPeerTeacher == undefined) return true; // show all labs if no PT selected
    return isPTandLabCompatible(lab, selectedPeerTeacher);
  });

  // TODO given a selected lab, highlight all PTs that can be assigned it
  function isPTandLabCompatible(lab: Lab, pt: PeerTeacher): boolean {
    return (
      // Lab not already assigned
      !lab?.assigned &&
      // PT schedule not conflict with lab
      !pt?.conflictsWith(lab.event) &&
      // PT's labs not conflict with this lab
      !assignedLabs.some((assignment) =>
        assignment.event.conflictsWith(lab.event)
      )
    );
  }

  function updateReactiveDeclarations() {
    selectedPeerTeacher = selectedPeerTeacher;
    peerTeachers = peerTeachers;
    labs = labs;
  }

  function assignLab(id: number) {
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = true;
    selectedPeerTeacher?.labs.add(id);
    updateReactiveDeclarations();
  }

  function unassignLab(id: number) {
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = false;
    selectedPeerTeacher?.labs.delete(id);
    updateReactiveDeclarations();
  }
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
      <div class="assign-box-header">Labs: {labs.length}</div>
      <div class="assign-box-body">
        {#each compatibleLabs as lab}
          <svelte:component
            this={LabBox}
            {lab}
            iconName="plus-circle"
            iconClick={() => {
              assignLab(lab.id);
            }}
          />
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
          <svelte:component
            this={LabBox}
            {lab}
            iconName="minus-circle"
            iconClick={() => {
              unassignLab(lab.id);
            }}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Bottom half: Universal unassigned labs -->
  <div class="flex flex-col mt-2 text-center">
    <h1>Unassigned Labs: {unassignedLabs.length}</h1>
    <div
      class="flex flex-row overflow-auto border-y-4 mt-1 border-slate-500 w-full items-center text-sm"
    >
      {#each unassignedLabs as lab}
        <!-- TODO on click, lab should be selected -->
        <div
          class="hover:animate-bounce border rounded-xl hover:bg-sky-100 hover:text-black px-3 py-1 mx-2"
        >
          <p>{lab.course}</p>
          <p>{lab.section}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
