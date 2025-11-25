<script lang="ts">
	let { children } = $props();
</script>

<div class="my-6 p-2 sm:p-4">
	{@render children()}
</div>
