<!-- This is the Root component that loads other components -->
<script lang="ts">
	import Sidebar from "./components/Sidebar.svelte";
</script>

<Sidebar />

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	@layer base {
		html {
			font-family: sans-serif, Proxima Nova;
		}
	}

	/* Custom Styles */
	@layer utilities {
		.assign-box {
			/* w-1/3 bg-green-500 flex flex-col border-solid hover:border-4 border-2 border-slate-400 */
			flex: none;
			flex-direction: column;
			width: 33.33%;
			display: flex;
			border-width: 4px;
			border-color: rgb(148 163 184);
		}
		.assign-box:hover {
			/* border-width: 6px; */
			border-color: black;
			border-width: 6px;
			/* border-width: 8px; */
			/* transition-timing-function: ease-in-out; */
		}

		.assign-box:hover > .assign-box-header {
			border-bottom-color: black;
			border-bottom-width: 6px;
		}

		.assign-box-header {
			font-size: 1.5rem;
			font-family: sans;
			border-bottom-color: rgb(148 163 184);
			border-bottom-width: 4px;
			text-align: center;
			/* height: 9%; */
			height: 10vh;
			overflow: hidden;
			flex: none;
		}

		.assign-box-body {
			/* flex-direction: row; */
			flex: 1 1 auto;
			overflow-y: auto;
			height: 100%;
		}
	}
</style>
