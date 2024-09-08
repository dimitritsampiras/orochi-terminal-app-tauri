<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import * as Card from '$lib/components/ui/card';
	import type { Tables } from '$lib/types/database';

	export let blank: Tables<'blanks'> | null | undefined;
	export let blankVariant: Tables<'blank_variants'> | null | undefined;
	export let hasBeenDeprecated: boolean | null;
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Blank Info</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if blank && blankVariant}
			<div class="flex items-end">
				<div>
					<div class="mb-4 flex items-center gap-4">
						<div>{blank.garment_type}</div>
						<div>{blankVariant.size}</div>
						<div>{blankVariant.color}</div>
					</div>

					<div class="mb-1 text-xs text-gray-500">Current Stock</div>
					<div class="text-5xl font-semibold">{blankVariant.quantity}</div>
				</div>
				{#if hasBeenDeprecated === true}
					<Badge class="h-5 text-[9px]" variant="secondary">deprecated</Badge>
				{/if}
			</div>
		{:else}
			<div>There is no connected blank for this line item.</div>
		{/if}
	</Card.Content>
</Card.Root>
