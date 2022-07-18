<script lang="ts">
  import type Lab from "../../models/Lab";
  import Icon from "../helpers/Icon.svelte";
  export let lab: Lab;
  export let iconClick = () => {};
  export let iconName: string;
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
      <Icon
        name={iconName}
        class="h-6 w-6"
        handleClick={() => {
          iconClick();
        }}
      />
    </div>
  </div>
  <!-- Bottom half -->
  <div>
    <p class="text-xs">{lab.event.info}</p>
    <p class="text-xs">{lab.building} {lab.room}</p>
  </div>
</div>
