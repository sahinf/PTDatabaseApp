<script lang="ts">
  import { labStore, ptStore } from "../stores";
  import type PeerTeacher from "../models/PeerTeacher";
  import Icon from "./helpers/Icon.svelte";
  import type { SnackbarComponentDev } from "@smui/snackbar";
  import Snackbar, { Label, Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";

  let selected_pt: PeerTeacher | undefined;
  let editing: boolean = false;

  let snackbarSuccess: SnackbarComponentDev;

  // TODO introducing layer of indirection to how Peer Teachers are displayed in order to sort based on aribitrary paramters
  function ptSort(a: PeerTeacher, b: PeerTeacher): number {
    return a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase());
  }
  $: peer_teachers = [...$ptStore.values()].sort(ptSort);

  function deletePT(id: number) {
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

  function copyEmailsToClipboard() {
    const emails = peer_teachers.flatMap((pt) => pt.email).join(",");
    navigator.clipboard.writeText(emails);
    if (snackbarSuccess) snackbarSuccess.open();
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
  <table class="table w-full table-compact">
    <thead class="sticky top-0">
      <tr>
        {#each headers as header, i}
          <th>
            {#if i == 0}
              <!-- display num PTs if first row -->
              {peer_teachers.length}
            {:else if header == "Email"}
              <div class="flex flex-row items-center">
                {header}
                <Icon
                  name="clipboard-copy"
                  class="h-4 w-4 ml-2 mt-0.5"
                  handleClick={copyEmailsToClipboard}
                />
              </div>
            {:else}
              {header}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#each peer_teachers as pt, i}
        <tr
          on:click={() => {
            selected_pt = pt;
          }}
          class={selected_pt == pt ? "active" : "hover"}
        >
          <td>{i + 1}</td>
          <td>
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
          </td>
          <td>{pt.lastname}</td>
          <td>{pt.email}</td>
          <td>{pt.id}</td>
          <td>{pt.phone}</td>
          <td>{pt.pref_work}</td>
          <td>{pt.lab_hours}</td>
          <td>{pt.gender}</td>
          <td>{pt.ethnicity}</td>
          <td>{pt.graduation}</td>
          <td>{pt.new_ret}</td>
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

<Snackbar bind:this={snackbarSuccess} class="demo-success">
  <Label>Successfully copied comma-separated list of emails</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
