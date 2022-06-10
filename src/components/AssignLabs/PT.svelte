<script lang="ts">
    import type PeerTeacher from "../../models/PeerTeacher";
    import Icon from "../helpers/Icon.svelte";
    export let pt: PeerTeacher;
</script>

<!-- PT Box -->
<div
    class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black h-20 overflow-hidden"
>
    <!-- Top half, name and button -->
    <div class="flex flex-row items-center ">
        <!-- Left half, name -->
        <strong class="flex-grow text-sm">{pt.name}</strong>

        <!-- Right half, button -->
        <!-- The button to open modal -->
        <label for="my-modal-4" class="">
            <Icon name="info" class="h-6 w-6" />
        </label>

        <!-- Modal PT event info -->
        <input type="checkbox" id="my-modal-4" class="modal-toggle" />
        <label for="my-modal-4" class="modal cursor-pointer">
            <label class="modal-box relative" for="">
                <h3 class="text-lg font-bold ">
                    {pt.name}
                </h3>
                {#each pt.events as e}
                    <p class="py-4">
                        {e.info}
                    </p>
                {/each}
            </label>
        </label>
    </div>

    <!-- Bottom half, hours -->
    <div class="">Hours: {pt.lab_hours}</div>
</div>
