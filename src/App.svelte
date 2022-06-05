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
			width: 33.33%;
			display: flex;
			flex-direction: column;
			border-width: 4px;
			border: solid;
			border-color: rgb(148 163 184);
		}
		.assign-box:hover {
			border-width: 6px;
			border-color: black;
		}

		.assign-box-header {
			font-size: 1.5rem;
			font-family: sans;
			border: solid;
			text-align: center;
			height: 10%;
			overflow: hidden;
		}


	}
</style>
