<script lang="ts">
    import type Lab from "../../models/Lab";
    import Icon from "../helpers/Icon.svelte";
    export let lab: Lab;
    export let assign: boolean = true;
</script>

<!-- Lab box -->
<div
    class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black h-20 overflow-hidden"
>
    <!-- Lab content -->
    <div class="flex flex-col">
        <!-- Top Half -->
        <div class="flex flex-row">
            <strong class="flex-grow">{lab.course} - {lab.section}</strong>
            {#if assign}
                <Icon name="plus-circle" class="h-6 w-6"/>
            {:else}
                <Icon name="minus-circle" class=""/>
            {/if}
        </div>
    </div>
    <!-- Bottom half -->
    <div>
        <p class="text-xs">{lab.event.info}</p>
        <p class="text-xs">{lab.building} {lab.room}</p>
    </div>
</div>

<!-- <div
    class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black h-20 overflow-hidden"
>
    <div class="flex flex-row items-center">
        <div class="flex-grow">
            <strong class="">{lab.course} - {lab.section}</strong>
            <p class="text-xs">{lab.event.info}</p>
            <p class="text-xs">{lab.building} {lab.room}</p>
        </div>

        <div>hi</div>
    </div>
</div> -->
