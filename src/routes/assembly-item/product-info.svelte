<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Tables } from '$lib/types/database';

	export let product: Tables<'products'> | null | undefined;
	export let productVariant: Tables<'product_variants'> | null | undefined;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Product Info</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if product && productVariant}
			<div class="mb-4 flex items-center gap-4">
			<div>{productVariant.title}</div>
			</div>
			<div class="mb-0 text-xs text-gray-500">Current Stock</div>
			<div class="text-5xl font-semibold">{productVariant.warehouse_inventory}</div>
		{:else}
			<div>There is no connected product for this line item.</div>
		{/if}
	</Card.Content>
</Card.Root>
