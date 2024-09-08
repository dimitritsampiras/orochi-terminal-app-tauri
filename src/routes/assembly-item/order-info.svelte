<script lang="ts">
	import StatusBadge from '$lib/components/ui/badge/status-badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Tables } from '$lib/types/database';
	import { cn } from '$lib/utils';

	import PhArrowRight from '~icons/ph/arrow-right';

	export let order: Tables<'orders'> & {
		line_items: Tables<'line_items'>[];
	};

	export let currentId: string;
</script>

<Card.Root>
	<Card.Header>
		<div class="flex justify-between">
			<Card.Title>Order Info</Card.Title>
			<!-- <Button variant="outline" size="sm" href={`/orders/${order.id.split('/').pop()}`}>
				View
				<PhArrowRight class="ml-2" />
			</Button> -->
		</div>
	</Card.Header>
	<Card.Content>
		<div class="mb-4 flex items-center gap-4">
			<div class="font-semibold">{order.name}</div>
			<StatusBadge status={order.display_fulfillment_status} />
		</div>

		{#each order.line_items.sort((a, b) => a.name.localeCompare(b.name)) as lineItem}
			<div class="mb-2 flex items-center gap-4">
				<div
					class={cn(
						'h-2 w-2 rounded-full',
						lineItem.id === currentId ? 'bg-blue-500' : 'bg-gray-200'
					)}
				/>
				<a href={`${lineItem.id.split('/').pop()}`} class="max-w-[60%] text-xs font-medium"
					>{lineItem.name}</a
				>
				<StatusBadge class="text-xs" status={lineItem.completion_status} />
			</div>
		{/each}
	</Card.Content>
</Card.Root>
