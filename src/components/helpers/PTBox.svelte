<script lang="ts">
    import type PeerTeacher from "../../models/PeerTeacher";
    import Icon from "./Icon.svelte";
    export let pt: PeerTeacher;

    let modalID = () => {
        return `my-modal-${pt.id}`;
    }
</script>

<!-- PT Box -->
<div
    class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black h-20 overflow-hidden group"
>
    <!-- Top half, name and button -->
    <div class="flex flex-row items-center ">
        <!-- Left half, name -->
        <strong class="flex-grow text-sm">{pt.name}</strong>

        <!-- Right half, button -->
        <!-- The button to open modal -->
        <label for={modalID()} class="">
            <Icon name="info" class="h-6 w-6" />
        </label>

        <!-- Modal PT event info -->
        <input type="checkbox" id={modalID()} class="modal-toggle" />
        <label for={modalID()} class="modal cursor-pointer">
            <label class="modal-box relative bg-slate-300" for="">
                <h3 class="text-lg font-bold font-serif underline">
                    {pt.name}
                </h3>
                {#each pt.events as e}
                    <p class="py-2">
                        {e.info}
                    </p>
                {/each}
            </label>
        </label>
    </div>

    <!-- Bottom half, hours -->
    <div class="">Hours: {pt.lab_hours}</div>
</div>
