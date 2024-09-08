<script lang="ts">
  import PhArrowRight from '~icons/ph/arrow-right';
  import PhArrowLeft from '~icons/ph/arrow-left';
  import PhXCircle from '~icons/ph/x-circle';

  import Button from '$lib/components/ui/button/button.svelte';

  import { cn } from '$lib/utils';
  // import { invalidate } from '$app/navigation';

  import * as Dialog from '$lib/components/ui/dialog';
  import PhImageSquare from '~icons/ph/image-square';
  import PhArrowsClockwise from '~icons/ph/arrows-clockwise';
  import BackButton from '$lib/components/ui/back-button.svelte';
  import PhBoxArrowDown from '~icons/ph/box-arrow-down';
  import { toast } from 'svelte-sonner';
  import StatusBadge from '$lib/components/ui/badge/status-badge.svelte';

  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { RealtimeChannel } from '@supabase/supabase-js';
  import * as Alert from '$lib/components/ui/alert';

  import PhWarning from '~icons/ph/warning';
  import BlankInfo from './blank-info.svelte';
  import ProductInfo from './product-info.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  import { doesFileExist, getFullPath, openFile } from './fs-utils';
  import { lineItemIds, settings } from '$lib/store';
  import type { Enums, Tables } from '$lib/types/database';
  import { supabase } from '$lib/supabase';
  import OrderInfo from './order-info.svelte';
  import { getAssemblyItem } from './getAssemblyItem';
  import { navigate } from 'svelte-routing';

  export let data: Awaited<ReturnType<typeof getAssemblyItem>>;

  const dispatch = createEventDispatcher();

  $: itemId = data.lineItem.id;
  $: index = $lineItemIds.findIndex((id) => id === data.lineItem.id) + 1;
  $: product = data.lineItem.product;

  $: slicedMedia = data.media.slice(0, 6);

  let selectedPrintId: string = '';
  let isLoading = false;

  let blankData: Awaited<typeof data.blankData>;
  let isBlankDataLoading = false;

  let openState = false;
  $: {
    isBlankDataLoading = true;
    data.blankData
      .then((result) => {
        blankData = result;
        isBlankDataLoading = false;
      })
      .catch((error) => {
        console.error('Error loading blank data:', error);
        isBlankDataLoading = false;
      });
  }

  async function handleReset() {
    isLoading = true;
    toast.loading('Resetting prints...', { duration: 500 });
    // if the item was previously marked as in stock and we're not resetting that
    // we need to increment the inventory
    if (data.lineItem.completion_status === 'in_stock' && data.lineItem.product_variants) {
      await supabase
        .from('product_variants')
        .update({
          warehouse_inventory: data.lineItem.product_variants.warehouse_inventory + 1
        })
        .eq('id', data.lineItem.product_variants.id);
    }

    if (data.lineItem.completion_status === 'oos_blank') {
      await supabase
        .from('line_items')
        .update({ completion_status: 'not_printed' })
        .eq('order_id', data.lineItem.order_id);
    }

    await supabase
      .from('print_logs')
      .update({ active: false })
      .eq('line_item_id', data.lineItem.id);

    await supabase
      .from('line_items')
      .update({ completion_status: 'not_printed' })
      .eq('id', data.lineItem.id);

    selectedPrintId = '';
    toast.success('Prints reset');

    dispatch('refetch');
    isLoading = false;
  }

  async function handleMarkAsStocked() {
    isLoading = true;
    await supabase
      .from('line_items')
      .update({ completion_status: 'in_stock' })
      .eq('id', data.lineItem.id);
    if (data.lineItem.product_variants) {
      const inventory = data.lineItem.product_variants.warehouse_inventory;
      await supabase
        .from('product_variants')
        .update({ warehouse_inventory: inventory > 0 ? inventory - 1 : 0 })
        .eq('id', data.lineItem.product_variants.id);
    }
    toast.success('Line item marked as stocked');
    dispatch('refetch');
    isLoading = false;
  }

  async function handleMarkAsOOS() {
    isLoading = true;
    await supabase
      .from('line_items')
      .update({ completion_status: 'oos_blank' })
      .eq('id', data.lineItem.id);

    await supabase
      .from('line_items')
      .update({ completion_status: 'skipped' })
      .eq('order_id', data.lineItem.order_id)
      .neq('id', data.lineItem.id);

    toast.success(
      'Line item marked as out of stock, and other items in the order have been skipped'
    );

    dispatch('refetch');

    isLoading = false;
  }

  async function markAsPrintedCatch() {
    if (
      data.lineItem.has_deprecated_blank_stock &&
      data.lineItem.completion_status !== 'partially_printed'
    ) {
      openState = true;
    } else {
      handleMarkAsPrinted();
    }
  }

  let shouldOpenFile = false;

  async function handleMarkAsPrinted(shouldDeprateBlank = false) {
    if (shouldOpenFile) {
      if (!fileExists) return;
      await openFile(arxpPath);
    }
    isLoading = true;
    toast.loading('Marking as printed...', { duration: 2000 });
    await supabase.from('print_logs').insert({
      print_id: selectedPrintId,
      line_item_id: data.lineItem.id,
      active: true
    });

    const { data: lineItem } = await supabase
      .from('line_items')
      .select('*,print_logs(*), products:products(*, prints:prints(*))')
      .eq('id', data.lineItem.id)
      .single();

    const activePrintLogs = lineItem?.print_logs.filter((log) => log.active).length;
    const totalPrints = lineItem?.products?.prints.length;

    if (activePrintLogs !== undefined && totalPrints !== undefined) {
      let updater = undefined;
      if (!lineItem?.has_deprecated_blank_stock || shouldDeprateBlank) {
        if (blankData) {
          const { quantity } = blankData.blankVariant;
          await supabase
            .from('blank_variants')
            .update({ quantity: quantity > 0 ? quantity - 1 : 0 })
            .eq('id', blankData.blankVariant.id);
        }

        updater = { has_deprecated_blank_stock: true };
      }

      await supabase
        .from('line_items')
        .update({
          completion_status: activePrintLogs < totalPrints ? 'partially_printed' : 'printed',
          ...updater
        })
        .eq('id', data.lineItem.id);
    }

    dispatch('refetch');
    toast.success('Print marked as printed');
    selectedPrintId = '';
    isLoading = false;
    openState = false;
    shouldOpenFile = false;
  }

  function navigateToLineItem(newIndex: number) {
    if (newIndex >= 0 && newIndex < $lineItemIds.length) {
      const newItemId = $lineItemIds[newIndex].split('/').pop();
      selectedPrintId = '';
      navigate(`/${newItemId}`, { replace: true });
    }
  }

  function getPrintStatus(printId: string) {
    const printLog = data.lineItem.print_logs
      .filter((log) => log.active)
      .find((log) => log.print_id === printId);

    return printLog?.active ? 'printed' : 'not printed';
  }

  function selectPrint(printId: string) {
    if (getPrintStatus(printId) === 'printed') return;
    if (selectedPrintId === printId) {
      selectedPrintId = '';
      return;
    }
    selectedPrintId = printId;
  }

  function previous() {
    navigateToLineItem(index - 2); // -2 because index is 1-based
  }

  function next() {
    navigateToLineItem(index); // index is already the next item because it's 1-based
  }

  let subscription: RealtimeChannel;
  let batchSubscription: RealtimeChannel;

  onMount(async () => {
    subscription = supabase
      .channel('line_item_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'line_items',
          filter: `id=eq.${data.lineItem.id}`
        },
        async () => {
          // invalidate('app:line_item');
          // invalidate('app:assembly');
          dispatch('refetch');
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
          toast.info('Session changed, may need to navigate back to assembly');
          navigate('/');
          dispatch('refetch');
        }
      )
      .subscribe();
  });

  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    if (batchSubscription) {
      batchSubscription.unsubscribe();
    }
  });

  let printSortOrder: Enums<'print_location'>[] = [
    'back',
    'front',
    'left_sleeve',
    'right_sleeve',
    'other'
  ];

  let arxpPath: string = '';
  let fileExists: boolean;
  $: {
    getFullPath(
      $settings.arxpPath,
      data.lineItem,
      data.lineItem.product?.prints.map((print) => print.id).indexOf(selectedPrintId) || 0
    ).then((path) => {
      arxpPath = path;
      doesFileExist(path).then((r) => {
        fileExists = r;
      });
    });
  }

  $: console.log(fileExists, arxpPath, data.lineItem.id);
</script>

<div>
  <BackButton hardBack="/" />
  <div class="mb-4 flex flex-wrap-reverse justify-between gap-4">
    <div>
      <h1 class="text-lg font-semibold">{index}. {data.lineItem.name}</h1>
      <h4 class="text-gray-600">
        {index} of {$lineItemIds.length}
      </h4>
    </div>
    <div class="flex items-center gap-4">
      <Button size="sm" variant="outline" on:click={previous} disabled={index === 1}>
        <PhArrowLeft class="mr-2 h-5 w-5" />
        Previous
      </Button>

      <Button
        size="sm"
        variant="outline"
        on:click={next}
        disabled={index === $lineItemIds.length}
      >
        Next
        <PhArrowRight class="ml-2 h-5 w-5" />
      </Button>
    </div>
  </div>

  <div class="grid-cols-[1fr_1fr] gap-4 lg:grid">
    <div class="flex flex-col gap-4">
      <div class="mb-4">
        <StatusBadge status={data.lineItem.completion_status} />
      </div>

      <!-- MEDIA -->
      <div
        class={cn(
          'grid grid-cols-4 gap-4 max-w-[30rem]',
          data.media.length > 2 ? 'grid-rows-3' : 'grid-rows-2'
        )}
      >
        {#each slicedMedia as media, i}
          <div
            class={cn(
              i === 0 && 'col-span-2 row-span-2',
              i === 1 && 'col-span-2 col-start-3 row-span-2',
              i >= 2 && 'row-start-3'
            )}
          >
            <div class="relative overflow-clip rounded-xl border bg-white">
              <img src={media.url} alt={media.alt} />
              <Dialog.Root>
                <Dialog.Trigger class="absolute left-2 top-2">
                  <Button variant="outline" class="bg-white" size="icon">
                    <PhImageSquare />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content class="max-w-4xl">
                  <img src={media.url} alt={media.alt} />
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
        {/each}
      </div>

      {#if ['not_printed', 'partially_printed', 'printed'].includes(data.lineItem.completion_status)}
        {#if product?.prints && product?.prints.length > 0}
          <div>
            <div class="flex gap-2">
              {#each product.prints.sort((a, b) => printSortOrder.indexOf(a.location) - printSortOrder.indexOf(b.location)) as print}
                <button
                  class={cn(
                    'flex flex-col gap-2 p-5',
                    'relative overflow-clip rounded-xl border-4 border-gray-200 bg-white transition-colors',
                    selectedPrintId === print.id && 'border-gray-400',
                    getPrintStatus(print.id) === 'printed' &&
                      'border-emerald-400 hover:cursor-not-allowed'
                  )}
                  on:click={() => selectPrint(print.id)}
                >
                  <div>Location: {print.location}</div>
                  <div>
                    <span>Heat Transfer:</span>
                    {#if print.heat_transfer_code}
                      <span
                        class={cn(
                          'w-fit rounded-lg  px-2 py-1 text-sm',
                          print.is_small_print
                            ? 'bg-purple-50 text-purple-800'
                            : 'bg-blue-50 text-blue-800'
                        )}
                      >
                        {print.heat_transfer_code}
                      </span>
                    {:else}
                      <span
                        class="w-fit rounded-lg border border-gray-500 px-2 py-1 text-sm text-gray-600"
                      >
                        None
                      </span>
                    {/if}
                  </div>
                  <div class="h-6 w-full" />
                  <div
                    class={cn(
                      'absolute bottom-0 left-0 right-0 flex h-8 flex-col items-center justify-center bg-gray-200',
                      getPrintStatus(print.id) === 'printed' &&
                        'bg-emerald-100 text-emerald-800'
                    )}
                  >
                    <div>
                      {print.id !== selectedPrintId ? getPrintStatus(print.id) : 'selected'}
                    </div>
                  </div>
                </button>
              {/each}
            </div>
            <div class="mt-4 flex gap-3">
              <Button
                variant="outline"
                size="icon"
                disabled={isLoading}
                on:click={handleReset}
              >
                <PhArrowsClockwise />
              </Button>
              <Button
                class="border-red-500 text-red-600 hover:border-red-400 hover:text-red-700"
                variant="outline"
                size="icon"
                disabled={data.lineItem.completion_status === 'oos_blank' || isLoading}
                on:click={handleMarkAsOOS}
              >
                <PhXCircle />
              </Button>
              <Button
                class="border-indigo-500 text-indigo-600 hover:border-indigo-400 hover:text-indigo-700"
                variant="outline"
                size="icon"
                disabled={data.lineItem.completion_status === 'in_stock' || isLoading}
                on:click={handleMarkAsStocked}
              >
                <PhBoxArrowDown />
              </Button>

              <Button
                variant="outline"
                class="hover:text-emerald-00 border-emerald-500 font-medium text-emerald-600 hover:border-emerald-400"
                disabled={!selectedPrintId ||
                  getPrintStatus(selectedPrintId) === 'printed' ||
                  isLoading}
                on:click={markAsPrintedCatch}>Mark As Printed</Button
              >

              <Button
                class="px-12"
                disabled={!selectedPrintId ||
                  getPrintStatus(selectedPrintId) === 'printed' ||
                  isLoading ||
                  !fileExists}
                on:click={() => {
                  shouldOpenFile = true;
                  markAsPrintedCatch();
                }}>Print and Open</Button
              >
            </div>
            <div>
              <div class={cn('mt-2')}>
                {#if selectedPrintId}
                  {#if fileExists}
                    {arxpPath.replace($settings.arxpPath, '').slice(1)}
                  {:else}
                    <span class="text-[10px] text-gray-500"
                      >cannot find file: {arxpPath
                        .replace($settings.arxpPath, '')
                        .slice(1)}</span
                    >
                  {/if}
                {/if}
              </div>
            </div>
          </div>
        {:else}
          <p>No prints found for this product</p>
        {/if}
      {:else}
        {#if data.lineItem.completion_status === 'in_stock'}
          <div
            class="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-6 text-sm text-indigo-900"
          >
            <PhBoxArrowDown class="mb-2 h-6 w-6 " />
            <div class="font-medium">Line item is in stock</div>
            <div class="font-light">
              Inventory has been decremented. You can reset status if this is not the case.
              Reseting the status will increment the inventory back to what it was.
            </div>
          </div>
        {:else if data.lineItem.completion_status === 'oos_blank'}
          <div
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-900"
          >
            <PhXCircle class="mb-2 h-6 w-6 " />
            <div class="font-medium">Line item is out of stock</div>
            <div class="font-light">
              Inventory has been decremented. You can reset status if this is not the case
            </div>
          </div>
        {:else if data.lineItem.completion_status === 'skipped'}
          <div
            class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-900"
          >
            <PhXCircle class="mb-2 h-6 w-6 " />
            <div class="font-medium">Line item is skipped.</div>
            <div class="font-light">
              Another item in this order was marked as out of stock and the order cant be
              completed.
            </div>
          </div>
        {/if}
        {#if data.lineItem.completion_status !== 'skipped'}
          <Button variant="outline" size="icon" disabled={isLoading} on:click={handleReset}>
            <PhArrowsClockwise />
          </Button>
        {/if}
      {/if}
    </div>
    <div class="mt-4">
      {#if !data.lineItem.product}
        <Alert.Root class="my-4 w-fit border-red-200 bg-red-50 text-red-700">
          <PhWarning class="h-4 w-4" />
          <Alert.Title>Product does not exist</Alert.Title>
          <Alert.Description>
            Either the product has been deleted or the line item is an edge case.
          </Alert.Description>
        </Alert.Root>
      {/if}

      {#if data.lineItem.quantity > 1}
        <Alert.Root class="my-4 w-fit border-amber-200 bg-amber-50 text-amber-700">
          <PhWarning class="h-4 w-4" />
          <Alert.Title>Multiple Quantity</Alert.Title>
          <Alert.Description>
            This line item has a quantity of {data.lineItem.quantity}. The app doesnt support
            multiple quantities. The second item needs to be printed manually.
          </Alert.Description>
        </Alert.Root>
      {/if}
      {#if data.lineItem.order?.display_fulfillment_status === 'FULFILLED'}
        <Alert.Root class="my-4 w-fit border-amber-200 bg-amber-50 text-amber-700">
          <PhWarning class="h-4 w-4" />
          <Alert.Title>Order already fulfilled</Alert.Title>
          <Alert.Description
            >Ensure that it was intential for this item to be in the assembly line.</Alert.Description
          >
        </Alert.Root>
      {/if}
      {#if data.lineItem.order}
        <OrderInfo order={data.lineItem.order} currentId={data.lineItem.id} />
        <div class="mt-4 flex flex-row gap-4">
          <div class="flex-1">
            {#if !blankData}
              {#if isBlankDataLoading}
                <div class="h-full w-full rounded-xl border bg-white p-4">loading...</div>
              {:else}
                <div
                  class="flex h-full w-full items-center justify-center rounded-xl border bg-white p-4"
                >
                  no blank
                </div>
              {/if}
            {:else}
              <BlankInfo
                blank={blankData?.blank}
                blankVariant={blankData?.blankVariant}
                hasBeenDeprecated={data.lineItem.has_deprecated_blank_stock}
              />
            {/if}
          </div>

          <div class="flex-1">
            <ProductInfo
              product={data.lineItem.product}
              productVariant={data.lineItem.product_variants}
            />
          </div>
        </div>
      {:else}
        <Alert.Root>
          <Alert.AlertDescription>Order Not Found?</Alert.AlertDescription>
        </Alert.Root>
      {/if}
    </div>
  </div>
</div>

<AlertDialog.Root
  open={openState}
  onOpenChange={(newState) => {
    openState = newState;
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Title>Deprecated Blank Stock</AlertDialog.Title>
    <AlertDialog.Description>
      At some point, this line item was printed and it blank stock was deprecated. For accurate
      inventory, select the correct option.
    </AlertDialog.Description>
    <AlertDialog.Footer>
      <Button variant="outline" on:click={() => handleMarkAsPrinted(true)}>
        Mark As Printed And Deperecate Blank
      </Button>
      <Button
        variant="outline"
        class="hover:text-emerald-00 border-emerald-500 font-medium text-emerald-600 hover:border-emerald-400"
        on:click={() => handleMarkAsPrinted(false)}
      >
        Only Mark As Printed
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
