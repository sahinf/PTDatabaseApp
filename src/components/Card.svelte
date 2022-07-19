<script lang="ts">
    export let title = "";
    export let desc = "";
</script>

<div class="card bg-primary text-primary-content">
    <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <p>{desc}</p>
        <div class="card-actions justify-end">
            <slot/>
        </div>
    </div>
</div>
