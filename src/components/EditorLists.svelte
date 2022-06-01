<script lang="ts">
  import IconButton from "@smui/icon-button";
  import List, {
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Text,
  } from "@smui/list";
  import type PeerTeacher from "../models/PeerTeacher";
  import { labStore, ptStore } from "../stores";

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
    selectedPeerTeacher?.labs.add(id);
    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;

    // Mark lab as assigned
    const lab = $labStore.get(id);
    if (lab !== undefined) lab.assigned = true;

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
    // Self assignment to update PT values used in `Peer Teacher` column
    peerTeachers = peerTeachers;
  }

  function unassignLab(id: number) {
    selectedPeerTeacher?.labs.delete(id);
    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;

    // Mark lab as unassigned
    const lab = $labStore.get(id);
    if (lab !== undefined) lab.assigned = false;

    // Self assignemnt to update `assignedLabs` and `compatibleLabs`
    selectedPeerTeacher = selectedPeerTeacher;
    // Self assignment to update PT values used in `Peer Teacher` column
    peerTeachers = peerTeachers;
  }
</script>

<div id="editor-lists">
  <div class="column">
    <h3 class="col-header">Peer Teachers</h3>
    <List twoLine singleSelection class="editor-list">
      {#each peerTeachers as pt}
        <Item on:SMUI:action={() => (selectedPeerTeacher = pt)}>
          <Text>
            <PrimaryText>{pt.name}</PrimaryText>
            <SecondaryText>{pt.id}</SecondaryText>
          </Text>
          <Meta>
            <IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                deletePT(pt.id);
              }}
            >
              remove_circle
            </IconButton>
          </Meta>
        </Item>
      {/each}
    </List>
  </div>
  <div class="column">
    <h3 class="col-header">Labs</h3>
    <List threeLine class="editor-list">
      {#each compatibleLabs as lab}
        <Item>
          <Text>
            <PrimaryText>{lab.course}-{lab.section}</PrimaryText>
            <SecondaryText>{lab.time}</SecondaryText>
            <SecondaryText>{lab.location}</SecondaryText>
          </Text>
          <Meta class="material-icons">
            <IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                assignLab(lab.id);
              }}
            >
              add_circle
            </IconButton>
          </Meta>
        </Item>
      {/each}
    </List>
  </div>
  <div class="column">
    <h3 class="col-header">
      {selectedPeerTeacher?.name ?? "PT"} - Assigned Labs
    </h3>
    <List threeLine class="editor-list">
      {#each assignedLabs as lab}
        <Item>
          <Text>
            <PrimaryText>{lab.course}-{lab.section}</PrimaryText>
            <SecondaryText>{lab.time}</SecondaryText>
            <SecondaryText>{lab.location}</SecondaryText>
          </Text>
          <Meta class="material-icons">
            <IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                unassignLab(lab.id);
              }}
            >
              remove_circle
            </IconButton>
          </Meta>
        </Item>
      {/each}
    </List>
  </div>
</div>

<style>
  #editor-lists {
    display: flex;
    max-height: inherit;
    min-height: 0;
    overflow-x: auto;
  }

  .col-header {
    font-family: Roboto, sans-serif;
  }

  .column {
    flex: 1;
    min-width: 15em;
    overflow: auto;
  }

  * :global(.editor-list) {
    border: 1px solid black;
  }
</style>
