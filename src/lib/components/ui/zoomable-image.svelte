<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from './button/button.svelte';

	export let src: string;
	export let alt: string;
</script>

<div class="relative">
	<Dialog.Root>
		<Dialog.Trigger>
			<Button size="icon" variant="outline" />
		</Dialog.Trigger>
		<Dialog.Content>
			<img class="h-full w-full rounded-3xl border" {src} {alt} />
		</Dialog.Content>
	</Dialog.Root>

	<img class="rounded-3xl border" {src} {alt} />
</div>
