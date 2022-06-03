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
</style>
