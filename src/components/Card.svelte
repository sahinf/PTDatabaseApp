<script lang="ts">
    export let title = "";
    export let desc = "";
</script>

<div class="card card-compact w-100 bg-primary text-primary-content">
    <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <p>{desc}</p>
        <div class="card-actions justify-end">
            <slot/>
        </div>
    </div>
</div>
