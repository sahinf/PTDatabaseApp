<script lang="ts">
    import { labStore, ptStore } from "../stores";
    import type Lab from "../models/Lab";

    let selected_lab: Lab | undefined;

    $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);


    let headers = ["", "Course", "Sec", "Time", "Location", "Assigned PT",""];
    
    $: pts = [...$ptStore.values()];
    
    // TODO Make this more efficient rather than checking each PT per each Lab
    $: labsAndPts = [...$labStore.values()].flatMap( (lab) => {
        return [{
            "lab" : lab,
            "pt" : pts.find( (pt) => {
                return pt.labs.has(lab.id)
            })
        }];
    });

</script>

<div class="overflow-auto h-full">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          {#each headers as header, i}
            <th> {i == 0 ? labs.length : header}</th>
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
            <th
              ><button
                class="btn btn-ghost btn-xs">Delete</button
              ></th
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  