<script lang="ts">
  export let name;
  export let width = "1rem";
  export let height = "1rem";
  export let focusable = "false";
  export let handleClick = () => {
    console.log(`No click handler passed to icon "${name}"`);
  };
  let icons = [
    {
      box: 24,
      name: "plus-circle",
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
    },
    {
      box: 24,
      name: "minus-circle",
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    },
    {
      name: "info",
      box: 24,
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    },
    {
      name: "download",
      box: 24,
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />`,
    },
    {
      name: "clipboard-copy",
      box: 24,
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />`,
    },
    {
      name: "checkmark",
      box: 20,
      path: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />`,
    },
  ];
  let displayIcon = icons.find((e) => e.name === name);
</script>

<svg
  on:click={handleClick}
  class={$$props.class}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 {displayIcon?.box} {displayIcon?.box}"
  stroke="currentColor"
  stroke-width={2}
  {width}
  {height}
  {focusable}
>
  {@html displayIcon?.path}</svg
>
