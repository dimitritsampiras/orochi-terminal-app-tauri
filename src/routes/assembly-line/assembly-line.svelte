<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import AssemblyTable from './assembly-table.svelte';

  import type { RealtimeChannel } from '@supabase/supabase-js';
  import { Input } from '$lib/components/ui/input';

  import { toast } from 'svelte-sonner';
  import { supabase } from '$lib/supabase';
  import type { AssemblyLineItem } from './getAssembly';
  import type { Tables } from '$lib/types/database';

  import axios from 'axios';
  import { lineItemIds } from '$lib/store';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  import * as Collapsible from '$lib/components/ui/collapsible';
  import CaretSort from 'svelte-radix/CaretSort.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { createQuery } from '@tanstack/svelte-query';

  // };

  let subscription: RealtimeChannel;
  let batchSubscription: RealtimeChannel;

  let searchTerm = '';

  const query = createQuery({
    queryKey: ['assembly'],
    queryFn: async () => {
      const response = await axios.get<{
        status: number;
        assemblyLine: {
          lineItems: AssemblyLineItem[];
          batch: Tables<'batches'>;
        };
      }>(`${import.meta.env.VITE_SERVER_URL}/api/assembly`);

      return response.data;
    }
  });

  onMount(async () => {
    subscription = supabase
      .channel('line_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'line_items' },
        async () => {
          await $query.refetch();
        }
      )
      .subscribe();
    batchSubscription = supabase
      .channel('batch_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'batches'
        },
        async () => {
          toast.info('Session changed');

          await $query.refetch();
        }
      )
      .subscribe();
  });

  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  $: stockedItems =
    $query.data?.assemblyLine.lineItems.filter(
      (item) => (item.product_variants?.warehouse_inventory || 0) > 0
    ) || [];

  $: lineItemIds.set($query.data?.assemblyLine.lineItems.map((i) => i.id) || []);
</script>

<h1 class="text-xl font-medium">Assembly</h1>

{#if $query.isLoading}
  <Skeleton class="h-14 mt-8" />
  <Skeleton class="h-32 mt-2" />
{:else if $query.data?.assemblyLine.batch === undefined}
  <div class="p-4 bg-gray-100 border-gray-300 border rounded-lg mt-4">
    No active session found.
  </div>
{:else}
  <p>Session: {$query.data?.assemblyLine.batch.id}</p>

  <Collapsible.Root class="my-4 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm">
    <Collapsible.Trigger class="flex w-full items-center font-semibold">
      Items that are in stock ({stockedItems.length})
      <Button size="iconsm" variant="outline" class="ml-4">
        <CaretSort />
      </Button>
    </Collapsible.Trigger>
    <Collapsible.Content class="mt-4">
      {#each stockedItems as stockedItem}
        <div class="flex gap-4">
          <a
            class="hover:cursor-pointer hover:underline"
            href={stockedItem.product_id
              ? `/products/${stockedItem.product_id?.split('/').pop()}`
              : `#`}>{stockedItem.name}</a
          >
          <div class="text-purple-600">
            {stockedItem.product_variants?.warehouse_inventory}
          </div>
        </div>
      {/each}
    </Collapsible.Content>
  </Collapsible.Root>

  <div class="my-4 flex justify-between">
    <Input class="w-fit bg-white" placeholder="search item" bind:value={searchTerm} />
  </div>
  <AssemblyTable
    assemblyLineItems={searchTerm
      ? $query.data?.assemblyLine.lineItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : $query.data?.assemblyLine.lineItems || []}
  />
{/if}

<div class="h-24" />
