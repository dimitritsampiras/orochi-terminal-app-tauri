<script lang="ts">
	import { type Variant, badgeVariants } from './index.js';
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;

	export let variant: Variant = 'default';
	export { className as class };
</script>

<svelte:element this="span" class={cn(badgeVariants({ variant, className }))} {...$$restProps}>
	<slot />
</svelte:element>
