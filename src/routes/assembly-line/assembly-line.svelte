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

  // let data = { batch: null, lineItems: [] } as {
  //   batch: Tables<'batches'> | null;
  //   lineItems: AssemblyLineItem[];
  // };

  let subscription: RealtimeChannel;
  let batchSubscription: RealtimeChannel;

  let searchTerm = '';

  // $: {
  //   if (data.lineItems) {
  //     if (searchTerm) {
  //       filteredLineItems = data.lineItems.filter((item) =>
  //         item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     } else {
  //       filteredLineItems = data.lineItems;
  //     }
  //   }
  // }

  import { createQuery } from '@tanstack/svelte-query';

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
