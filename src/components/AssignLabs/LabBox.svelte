<script lang="ts">
    import type Lab from "../../models/Lab";
    import type PeerTeacher from "../../models/PeerTeacher";
    import Icon from "../helpers/Icon.svelte";
    export let lab: Lab;
    export let assign: boolean = true;
    export let selectedPeerTeacher: PeerTeacher | null = null;
    export let iconClick = () => {}
    export let iconName :string = "plus-circle";
</script>

<!-- Lab box -->
<div
    class="block border-b px-3 py-3 hover:bg-sky-100 hover:text-black h-20 overflow-hidden"
>
    <!-- Lab content -->
    <div class="flex flex-col">
        <!-- Top Half -->
        <div class="flex flex-row">
            <strong class="flex-grow">CSCE {lab.course} - {lab.section}</strong>
            <Icon name="minus-circle" class="h-6 w-6" handleClick={()=>{iconClick()}}/>
        </div>
    </div>
    <!-- Bottom half -->
    <div>
        <p class="text-xs">{lab.event.info}</p>
        <p class="text-xs">{lab.building} {lab.room}</p>
    </div>
</div>

 <!-- {#if assign}
                <Icon
                    name="plus-circle"
                    class="h-6 w-6"
                    handleClick={() => {
                        iconClick()
                        // selectedPeerTeacher?.assignLab(lab.id);
                        //TODO Adding a lab to a PT doesn't update the current "Labs" and "PT's Labs" columns 
                        //TODO This was handled by self assignment in the assign labs function in Scott's version, but now this logic is passed down into a child component (this component) and self-assigning down here does not seem to help

                        //// selectedPeerTeacher = selectedPeerTeacher;
                    }}
                />
            {:else}
                <Icon
                    name="minus-circle"
                    class="h-6 w-6"
                    handleClick={() => {
                        console.log(
                            selectedPeerTeacher?.name,
                            lab.course,
                            lab.section
                        );
                    }}
                />
            {/if} -->