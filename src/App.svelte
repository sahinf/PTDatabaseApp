<!-- This is the Root component that loads other components -->
<script lang="ts">
	import Editor from "./components/Editor.svelte";
	import Sidebar from "./Sidebar.svelte";
</script>

<Sidebar />
<Editor />

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
