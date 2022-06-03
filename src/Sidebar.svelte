<script>
    import DarkModeSwitch from "./DarkModeSwitch.svelte";

    $: active_section = 2;

    let sections = [
        'File Uploads',
        'Peer Teachers',
        'Labs',
        'Active Peer Teachers',
        'Stats',
        'TAMU html output'
    ]
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
            <ul class="menu bg-base-100 w-full">
                {#each sections as sec, i}
                    <li><div> {sec} </div></li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Main content -->
    <div class="flex-auto">Content</div>
</div>
