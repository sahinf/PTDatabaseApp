<!-- Entire Page -->
<div class="flex flex-row h-screen">
    <!-- SIDEBAR -->
    <div class="w-2/12 flex flex-col border-r">
        <!-- Header for sidebar sections -->
        <div
            class="font-serif flex-none text-center text-2xl text-neutral-900 p-4 border-b font-black"
        >
            Peer Teacher Manager
        </div>

        <!-- Sidebar sections -->
        <div class=" overflow-y-auto">
            {#each Array(20) as _, i}
                <div
                    class="flex h-20 bg-sky-400 hover:bg-sky-700 active:bg-sky-800 border-b hover:drop-shadow-2xl font-bold justify-center items-center"
                >
                    Selection {i + 1}
                </div>
                <button class="btn btn-primary">Button</button>
            {/each}
        </div>
    </div>

    <!-- Main content -->
    <div class="flex-auto">Content</div>
</div>
