<script lang="ts">
  import DarkModeSwitch from "./helpers/DarkModeSwitch.svelte";
  import AssignLabs from "./AssignLabs.svelte";
  import FileUploads from "./FileUploads.svelte";
  import PeerTeachers from "./PeerTeachers.svelte";
  import Labs from "./Labs.svelte";
  import TamuOutput from "./TamuOutput.svelte";
  import { onMount } from "svelte";
  import { parseDatabaseLocalStorage } from "../util/parser";

  let sections = [
    { name: "File Uploads", component: FileUploads },
    { name: "Peer Teachers", component: PeerTeachers },
    { name: "Assign Labs", component: AssignLabs },
    { name: "Labs", component: Labs },
    { name: "Active Peer Teachers", component: null }, // TODO
    { name: "Stats", component: null }, // TODO
    { name: "TAMU Html Output", component: TamuOutput },
  ];

  let selected = sections[0];

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
  <div class="flex-none w-2/12 flex-col border-r">
    <!-- Header for sidebar sections -->
    <div
      class="font-serif flex-none text-center text-3xl p-1 border-b font-black overflow-hidden"
    >
      <!-- Text -->
      <div
        class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
      >
        Peer Teacher Manager
      </div>
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
  <div class="flex-auto h-full overflow-y-hidden">
    <svelte:component this={selected.component} />
  </div>
</div>
