<script lang="ts">
	export let countryName: string | null;
	export let countryCode: string | null;

	// You could also use a reactive statement if needed for more complex conditions
	$: flagClass = `fi fi-${countryCode?.toLowerCase()}`;
</script>

<!-- Option 1: Using if block -->

<div class="flex items-center gap-2 font-medium">
	<div class={flagClass} />
	<div>{countryName || 'no country'}</div>
</div>
