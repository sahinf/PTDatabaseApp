<script lang="ts">
  import IconButton from "@smui/icon-button";
  import List, {
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Text,
  } from "@smui/list";
  import { labStore, ptStore } from "../stores";

  $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
    a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
  );

  $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);

  const nothing: any[] = [];
</script>

<div id="editor-lists">
  <div class="column">
    <h3 class="col-header">Peer Teachers</h3>
    <List twoline singleSelection class="editor-list">
      {#each peerTeachers as pt}
        <Item>
          <Text>
            <PrimaryText>{pt.firstname} {pt.lastname}</PrimaryText>
            <SecondaryText>{pt.id}</SecondaryText>
          </Text>
          <Meta>
            <IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                ptStore.update((val) => {
                  val.delete(pt.id);
                  return val;
                });
              }}>remove_circle</IconButton
            >
          </Meta>
        </Item>
      {/each}
    </List>
  </div>
  <div class="column">
    <h3 class="col-header">Labs</h3>
    <List twoline singleSelection class="editor-list">
      {#each labs as lab}
        <Item>
          <Text>
            <PrimaryText>{lab.course}-{lab.section} [{lab.time}]</PrimaryText>
            <SecondaryText>
              {lab.location}
            </SecondaryText>
          </Text>
          <Meta class="material-icons"
            ><IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                console.log("hello");
              }}>add_circle</IconButton
            ></Meta
          >
        </Item>
      {/each}
    </List>
  </div>
  <div class="column">
    <h3 class="col-header">PT - Assigned Labs</h3>
    <List twoline singleSelection class="editor-list">
      {#each nothing as n}
        <Item>
          <Text>
            <PrimaryText>{n.course} {n.section}</PrimaryText>
            <SecondaryText>
              {n.event.days}
              {n.event.start}-{n.event.end}
            </SecondaryText>
          </Text>
          <Meta class="material-icons"
            ><IconButton
              class="material-icons"
              on:click$stopPropagation={() => {
                console.log("hello");
              }}>remove_circle</IconButton
            ></Meta
          >
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
