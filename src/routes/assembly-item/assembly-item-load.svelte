<script lang="ts">
  import { getAssemblyItem } from './getAssemblyItem';
  import AssemblyItem from './assembly-item.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import BackButton from '$lib/components/ui/back-button.svelte';
  import { createQuery } from '@tanstack/svelte-query';

  export let itemId;

  const query = createQuery({
    queryKey: ['assembly', itemId],
    queryFn: async () => {
      // return itemId;
      return await getAssemblyItem(itemId);
    }
  });

  const handleRefetch = async () => {
    console.log('here!');

    await $query.refetch();
  };

  $: if (itemId !== $query.data?.lineItem.id) {
    console.log('here again');

    handleRefetch();
  }
</script>

{#if $query.isLoading}
  <BackButton hardBack="/" />
  <Skeleton class="h-32" />
  <Skeleton class="h-32 mt-4" />
{:else if $query.data}
  <AssemblyItem data={$query.data} on:refetch={handleRefetch} />
{:else}
  <BackButton hardBack="/" />
  <div>something went wrong?</div>
{/if}
