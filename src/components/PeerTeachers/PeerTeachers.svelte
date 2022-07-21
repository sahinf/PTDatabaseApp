<script lang="ts">
  import { each } from "svelte/internal";
  import { labStore, ptStore } from "../../stores";
  import type PeerTeacher from "src/models/PeerTeacher";

  $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
    a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
  );
  const headers = ["", "Name", "UIN", "Labs"];
</script>

<div class="overflow-scroll">
  <div class="overflow-auto ">
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
          <tr>
            <th>{i + 1}</th>
            <th>{pt.name}</th>
            <th>{pt.id}</th>
            <th>
              {#each Array.from(pt.labs) as lab_id}
                {lab_id}, 
              {/each}
            </th>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
