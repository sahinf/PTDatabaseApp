<script>
    import DarkModeSwitch from "./components/DarkModeSwitch.svelte";
    
    let active_section : undefined;

    let sections = [
        'File Uploads',
        'Peer Teachers',
        'Labs',
        'Active Peer Teachers',
        'Stats',
        'TAMU html output'
    ]

    let sections2 = [
        {name: 'File Uploads', file: null, isActive: 'active'},
        {name: 'Peer Teachers', file: null, isActive: 'active'}
    ]

    function chooseSection(sec) {
        active_section = sec;
        console.log('Chose section', active_section)
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
                {#each sections as sec, i}
                    <li><div class=""> {sec} </div></li>
                {/each}
                {#each sections2 as sec, i}
                    <li><div class="" on:click={() => chooseSection(sec)}> {sec.name} </div></li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Main content -->
    <div class="flex-auto">Content</div>
</div>
