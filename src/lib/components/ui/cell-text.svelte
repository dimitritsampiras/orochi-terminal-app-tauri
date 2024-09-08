<script lang="ts">
	export let value;

	let className = '';

	export { className as class };
</script>

<span class={className}>{value}</span>
