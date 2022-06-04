<script lang="ts">
    import DarkModeSwitch from "./DarkModeSwitch.svelte";
    import AssignLabs from "./AssignLabs.svelte";
    import FileUploads from "./FileUploads.svelte"

    let sections = [
        { name: "File Uploads", component: FileUploads },
        { name: "Peer Teachers", component: null },
        { name: "Assign Labs", component: AssignLabs },
        { name: "Labs", component: null },
        { name: "Active Peer Teachers", component: null },
        { name: "Stats", component: null },
        { name: "TAMU Html Output", component: null },
    ];

    let selected = sections[0];

    function chooseSection(sec) {
        selected = sec;
    }
</script>

<!-- Entire Page -->
<div class="flex flex-row h-screen">
    <!-- SIDEBAR -->
    <div class="w-2/12 flex flex-col border-r">
        <!-- Header for sidebar sections -->
        <div
            class="font-serif flex-none text-center text-2xl text-neutral-900 p-4 border-b font-black"
        >
            <!-- Text -->
            <div>Peer Teacher Manager</div>
            <div>
                <DarkModeSwitch />
            </div>
        </div>

        <!-- Sidebar sections -->
        <div class="flex-col overflow-y-auto">
            <ul class="menu bg-base-100 w-full text-xl">
                {#each sections as sec}
                    <li>
                        <div
                            class={selected == sec ? "active" : ""}
                            on:click={() => chooseSection(sec)}
                        >
                            {sec.name}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Chosen Section / Component -->
    <div class="flex-auto">
        <svelte:component this={selected.component} />
    </div>
</div>
