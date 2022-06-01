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
</script>

<div class="assign-labs">
  <div class="column">
    <div class="col-header">Peer Teachers</div>
    <List threeLine avatarList singleSelection class="editor-list">
      {#each peerTeachers as pt}
        <Item on:SMUI:action={() => (selectedPeerTeacher = pt)}>
          <Text>
            <PrimaryText>{pt.name}</PrimaryText>
            <SecondaryText>{pt.id}</SecondaryText>
            <SecondaryText>Assigned hours: {pt.hours}</SecondaryText>
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
    <div class="col-header">Labs</div>
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
    <div class="col-header">
      {selectedPeerTeacher?.name ?? "PT"}
    </div>
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
  .assign-labs {
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
    /* font-size: 0.90em; */

    /* border: 5px solid red;
    border-style: solid;
    background-color: pink; */
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
  }
</style>
