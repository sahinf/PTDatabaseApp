<script lang="ts">
  import DarkModeSwitch from "./DarkModeSwitch.svelte";
  import AssignLabs from "./AssignLabs/AssignLabs.svelte";
  import FileUploads from "./FileUploads.svelte";
  import { onMount } from "svelte";
  import { parseDatabaseLocalStorage } from "../util/parser";

  let sections = [
    { name: "File Uploads", component: FileUploads },
    { name: "Peer Teachers", component: null }, // TODO
    { name: "Assign Labs", component: AssignLabs },
    { name: "Labs", component: null }, // TODO
    { name: "Active Peer Teachers", component: null }, // TODO
    { name: "Stats", component: null }, // TODO
    { name: "TAMU Html Output", component: null }, // TODO
  ];

  // Set initial page to Assign Labs while I work on it
  let selected = sections[2];

  // Load from local storage. FOR TESTING PURPOSES ONLY. REMOVE THIS FROM PRODUCTION
  onMount(() => {
    const db = localStorage.getItem("db");
    if (db) {
      console.log("Using database found in local storage");
      parseDatabaseLocalStorage(db);
    } else {
      console.log("No database found in local storage");
    }
  });
</script>

<!-- Entire Page -->
<div class="flex flex-row h-screen">
  <!-- SIDEBAR -->
  <div class="w-2/12 flex flex-col border-r">
    <!-- Header for sidebar sections -->
    <div
      class="font-serif flex-none text-center text-2xl text-neutral-900 p-4 border-b font-black overflow-hidden"
    >
      <!-- Text -->
      <div>Peer Teacher Manager</div>
      <div>
        <DarkModeSwitch />
      </div>
    </div>

    <!-- Sidebar sections -->
    <div class="flex-col overflow-y-auto">
      <ul class="menu bg-base-100 w-full text-xl">
        {#each sections as sec}
          <li>
            <div
              class={selected == sec ? "active" : ""}
              on:click={() => {
                selected = sec;
              }}
            >
              {sec.name}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Chosen Section / Component -->
  <div class="flex-auto">
    <svelte:component this={selected.component} />
  </div>
</div>
