<script lang="ts">
  import { labStore, ptStore } from "../../stores";
  import type PeerTeacher from "../../models/PeerTeacher";

  let selected_pt: PeerTeacher | undefined;

  $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
    a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
  );

  function deletePT(id: number) {
    // if (selected_pt.id != id) return;
    // Unassign all labs assigned to this Peer Teacher
    $ptStore.get(id)?.labs.forEach((lab_id) => {
      const lab = $labStore?.get(lab_id);
      lab.assigned = false;
    });

    // Yeet the Peer Teacher
    ptStore.update((map) => {
      map.delete(id);
      return map;
    });
  }

  const headers = ["", "First", "Last", "UIN", "Email", "Lab Hours", ""];
</script>

<div class="overflow-auto h-full">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        {#each headers as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each peerTeachers as pt, i}
        <tr
          on:click={() => {
            selected_pt = pt;
          }}
          class={selected_pt == pt ? "active" : "hover"}
        >
          <th>{i + 1}</th>
          <th>{pt.firstname}</th>
          <th>{pt.lastname}</th>
          <th>{pt.id}</th>
          <th>{pt.email}</th>
          <th>
            {pt.lab_hours}
          </th>
          <th
            ><button
              on:click={() => deletePT(pt.id)}
              class="btn btn-ghost btn-xs">Delete</button
            ></th
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
