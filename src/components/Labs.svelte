<script lang="ts">
  import { labStore, ptStore } from "../stores";
  import type Lab from "../models/Lab";
  import Icon from "./helpers/Icon.svelte";

  let selected_lab: Lab | undefined;

  $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);

  let headers = ["", "Course", "Sec", "Time", "Location", "Assigned PT", ""];

  $: pts = [...$ptStore.values()];

  // TODO Make this more efficient rather than checking each PT per each Lab
  $: labsAndPts = [...$labStore.values()].flatMap((lab) => {
    return [
      {
        lab: lab,
        pt: pts.find((pt) => {
          return pt.labs.has(lab.id);
        }),
      },
    ];
  });

  function download() {
    // prepare data in CSV format
    let cols = headers.slice(1, -1);
    let csv = cols.join(",") + "\n";
    labsAndPts.forEach((row) => {
      let l = row.lab;
      csv += `${l.course},${l.section},${l.time},${l.location},${
        row.pt?.name ?? "UNASSIGNED"
      }\n`;
    });
    console.log(csv);

    const blob = new Blob([csv], { type: "text/csv" });
    const anchor = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = "lab-assignments.csv";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
</script>

<div class="overflow-auto h-full">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        {#each headers as header, i}
          {#if i == 0}
            <th>
              {labs.length}
              <Icon name="download" class="h-4 w-4" handleClick={download} />
            </th>
          {:else}
            <th>{header}</th>
          {/if}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each labsAndPts as l, i}
        <tr
          on:click={() => {
            selected_lab = l.lab;
          }}
          class={selected_lab == l.lab ? "active" : "hover"}
        >
          <th>{i + 1}</th>
          <th>{l.lab?.course}</th>
          <th>{l.lab?.section}</th>
          <th>{l.lab?.time}</th>
          <th>{l.lab?.location}</th>
          <th>{l.pt?.name ?? "UNASSIGNED"}</th>
          <th><button class="btn btn-ghost btn-xs">Delete</button></th>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
