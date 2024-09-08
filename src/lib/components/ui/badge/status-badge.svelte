<script lang="ts">
	import type { Product, ProductStatus } from '$lib/types/admin.types';
	import type { Enums, Tables } from '$lib/types/database';
	import { cn } from '$lib/utils';

	import Badge from './badge.svelte';

	type Status =
		| Enums<'display_fulfillment_status'>
		| Enums<'fulfillment_priority'>
		| Enums<'shipping_priority'>
		| 'queued'
		| 'not queued'
		| 'complete'
		| 'incomplete'
		| 'INACTIVE'
		| Enums<'line_item_completion_status'>
		| `${Product['status']}`;

	export let status: Status | null;

	let className: string | undefined | null = undefined;
	export { className as class };

	const statusClasses: Record<Status, string> = {
		ACTIVE: 'border-transparent bg-emerald-100 text-emerald-800',
		DRAFT: 'border-transparent bg-blue-100 text-blue-800',
		ARCHIVED: 'border-transparent bg-gray-100 text-gray-800',

		INACTIVE: 'border-transparent bg-gray-100 text-gray-800',

		queued: 'border-transparent bg-lime-100 text-lime-800',
		'not queued': 'border-transparent bg-slate-100 text-slate-800',

		FULFILLED: 'border-transparent bg-green-100 text-green-800',
		IN_PROGRESS: 'border-transparent bg-lime-100 text-lime-800',
		UNFULFILLED: 'border-transparent bg-amber-100 text-amber-800',
		ON_HOLD: 'border-transparent bg-red-100 text-red-800',
		OPEN: 'border-transparent bg-blue-100 text-blue-800',
		PARTIALLY_FULFILLED: 'border-transparent bg-orange-100 text-orange-800',
		PENDING_FULFILLMENT: 'border-transparent bg-yellow-100 text-yellow-800',
		RESTOCKED: 'border-transparent bg-purple-100 text-purple-800',
		SCHEDULED: 'border-transparent bg-cyan-100 text-cyan-800',

		standard: 'border-transparent bg-slate-100 text-slate-800',
		express: 'border-transparent bg-violet-100 text-violet-800',
		fastest: 'border-transparent bg-indigo-100 text-indigo-800',

		normal: 'border-transparent bg-zinc-100 text-zinc-800',
		critical: 'border-transparent bg-red-100 text-red-800',
		urgent: 'border-transparent bg-purple-100 text-purple-800',

		complete: 'border-transparent bg-blue-100 text-blue-800',
		incomplete: 'border-transparent bg-red-100 text-red-800',

		not_printed: 'border-transparent bg-gray-100 text-gray-800',
		partially_printed: 'border-transparent bg-yellow-100 text-yellow-800',
		printed: 'border-transparent bg-emerald-100 text-emerald-800',
		in_stock: 'border-transparent bg-indigo-100 text-indigo-800',
		oos_blank: 'border-transparent bg-red-100 text-red-800',
		skipped: 'border-transparent bg-amber-100 text-amber-800',
		ignore: 'border-gray-500 bg-gray-50 text-gray-800'
	};
</script>

<Badge class={cn(status && statusClasses[status], className, 'lowercase')}>
	{status?.replaceAll('_', ' ')}
</Badge>
