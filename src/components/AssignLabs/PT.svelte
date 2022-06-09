<script lang="ts">
    import type PeerTeacher from "../../models/PeerTeacher";
    export let pt: PeerTeacher;
</script>

<!-- PT Box -->
<div class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black">
    <!-- Top half, name and button -->
    <div class="flex flex-row items-center">
        <!-- Left half, name -->
        <strong class="flex-grow text-sm">{pt.name}</strong>
        <!-- Right half, button -->

        <!-- The button to open modal -->
        <label for="my-modal-4" class="">
            <svg
                on:click={() => console.log(pt.name)}
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2}
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </label>

        <input type="checkbox" id="my-modal-4" class="modal-toggle"/>
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

    <!-- Bottom -->
    <div>Hours: {pt.lab_hours}</div>
</div>
