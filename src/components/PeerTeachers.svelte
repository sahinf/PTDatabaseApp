<script lang="ts">
  import { labStore, ptStore } from "../stores";
  import type PeerTeacher from "../models/PeerTeacher";

  let selected_pt: PeerTeacher | undefined;
  let editing: boolean = false;

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

  let headers = [
    "",
    "First",
    "Last",
    "Email",
    "UIN",
    "Phone",
    "Pref",
    "Lab",
    "Gen",
    "Ethnicity",
    "Grad",
    "Status",
    "",
  ];
</script>

<div class="overflow-auto h-full">
  <table class="table table-compact w-full">
    <!-- head -->
    <thead>
      <tr>
        {#each headers as header, i}
          <th> {i == 0 ? peerTeachers.length : header}</th>
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
          <th>
            {#if editing && selected_pt == pt}
              <input
                bind:value={pt.firstname}
                type="text"
                class="input input-bordered input-primary  w-full max-w-xs"
                on:blur={() => (editing = false)}
              />
            {:else}
              <div on:dblclick={() => (editing = true)}>
                {pt.firstname}
              </div>
            {/if}
          </th>
          <th>{pt.lastname}</th>
          <th>{pt.email}</th>
          <th>{pt.id}</th>
          <th>{pt.phone_number}</th>
          <th>{pt.pref_work}</th>
          <th>{pt.lab_hours}</th>
          <th>{pt.gender}</th>
          <th>{pt.ethnicity}</th>
          <th>{pt.graduation}</th>
          <th>{pt.new_ret}</th>
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
