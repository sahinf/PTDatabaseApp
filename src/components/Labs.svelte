<script lang="ts">
  import { labStore, ptStore } from "../stores";
  import type Lab from "../models/Lab";
  import Icon from "./helpers/Icon.svelte";

  let selected_lab: Lab | undefined;

  $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);

  let headers = [
    "",
    "Course",
    "Time",
    "Location",
    "Instructor",
    "Assigned PT",
    "",
  ];

  $: pts = [...$ptStore.values()];

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

  function displayFaculty(lab: Lab): string {
    if (lab.faculty.length > 0) {
      let s: string[] = [];
      lab.faculty.forEach((f) => {
        s.push(f.displayName);
      });
      return s.join(",");
    } else {
      return "N/A";
    }
  }
  function download() {
    // prepare data in CSV format
    let cols = headers.slice(1, -1);
    let csv = cols.join(",") + "\n";
    labsAndPts.forEach((row) => {
      let l = row.lab;
      csv += `${l.course},${l.section},${l.time},${l.location},${displayFaculty(
        l
      )},${row.pt?.name ?? "UNASSIGNED"}\n`;
    });

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
              <div class="flex flex-row">
                {labs.length}
                <Icon
                  name="download"
                  class="h-4 w-4 ml-2"
                  handleClick={download}
                />
              </div>
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
          <td>{i + 1}</td>
          <td>{l.lab?.course} - {l.lab?.section}</td>
          <td>{l.lab?.time}</td>
          <td>{l.lab?.location}</td>
          <td>{displayFaculty(l.lab)}</td>
          <td>{l.pt?.name ?? "UNASSIGNED"}</td>
          <td><button class="btn btn-ghost btn-xs">Delete</button></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
