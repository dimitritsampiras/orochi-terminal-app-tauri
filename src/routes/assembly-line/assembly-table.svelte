<script lang="ts">
  import StatusBadge from '$lib/components/ui/badge/status-badge.svelte';

  import CellText from '$lib/components/ui/cell-text.svelte';
  import * as Table from '$lib/components/ui/table';

  import type { Enums } from '$lib/types/database';
  import { cn, colorNameToHex } from '$lib/utils';

  import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
  import { writable } from 'svelte/store';
  import type { AssemblyLineItem } from './getAssembly';
  import { navigate } from "svelte-routing";

  export let assemblyLineItems: AssemblyLineItem[];

  const mapAssemblyItems = (items: AssemblyLineItem[]) =>
    items.map((item) => ({
      ...item,
      blankColor: item.product_variants?.blank_variants?.color,
      blankSize: item.product_variants?.blank_variants?.size,
      heatTransfer: {
        // TODO: this should be filter instead of find and display all heat transfers
        code: item.products?.prints.find((print) => print.heat_transfer_code)
          ?.heat_transfer_code,
        isSmall: item.products?.prints.find((print) => print.heat_transfer_code)
          ?.is_small_print
      }
    }));

  const assemblyStore = writable(mapAssemblyItems(assemblyLineItems));

  // Update productsStore when products prop changes
  $: assemblyStore.set(mapAssemblyItems(assemblyLineItems));

  let table = createTable(assemblyStore);

  const columns = table.createColumns([
    table.column({
      accessor: 'id',
      header: 'Num',
      id: 'id',
      cell: ({ value, row }) =>
        createRender(CellText, {
          value: `${assemblyLineItems.map((item) => item.id).indexOf(value) + 1}`
        })
    }),
    table.column({
      accessor: 'name',
      header: 'Product',
      cell: ({ value, row }) =>
        createRender(CellText, {
          value: `${value} ${row.isData() && row.original.quantity > 1 ? `(${row.original.quantity})` : ''}`,
          class: 'font-medium'
        })
    }),
    table.column({
      accessor: 'blankColor',
      header: 'Blank Color',
      cell: ({ value }) => createRender(CellText, { value, class: 'font-medium' })
    }),
    table.column({
      accessor: 'blankSize',
      header: 'Blank Size',
      cell: ({ value }) =>
        createRender(CellText, { value: formatBlankSize(value), class: 'font-medium' })
    }),
    table.column({
      accessor: 'heatTransfer',
      header: 'Heat Transfer'
    }),
    table.column({
      accessor: 'completion_status',
      header: 'Status',
      cell: ({ value }) => createRender(StatusBadge, { status: value })
    })
  ]);

  const formatBlankSize = (size: Enums<'garment_size'> | undefined) => {
    if (!size) return '--';
    const sizeMap: Record<string, string> = {
      xs: 'xsmall',
      sm: 'small',
      md: 'medium',
      lg: 'large',
      xl: 'xlarge',
      os: 'one size'
    };
    return sizeMap[size] || size;
  };

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

  const handleRowClick = (lineItemId: string) => {
    navigate(`/${lineItemId.split('/').pop()}`);
  };
</script>

<div class="rounded-md border bg-white">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row, index (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row
            class={cn('hover:cursor-pointer hover:bg-gray-100', {
              'bg-gray-50': index % 2 === 0
            })}
            on:click={() => {
              row.isData() && handleRowClick(row.original.id);
            }}
            {...rowAttrs}
          >
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                {#if cell.id === 'id'}
                  <Table.Cell {...attrs} class="w-1 max-w-1">
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === 'name'}
                  <Table.Cell {...attrs}>
                    <div class="flex items-center gap-4">
                      <div class="font-medium">
                        {cell.row.isData() && cell.row.original.name}
                      </div>
                      {#if cell.row.isData() && cell.row.original.quantity > 1}
                        <span> x{cell.row.original.quantity}</span>
                      {/if}
                    </div>
                  </Table.Cell>
                {:else if cell.id === 'blankColor'}
                  <Table.Cell {...attrs} class="flex items-center gap-2">
                    {#if cell.row.isData()}
                      {#if cell.row.original.blankColor}
                        <div
                          class={cn(
                            'h-4 w-4 rounded-full',
                            colorNameToHex(cell.row.original.blankColor || '')
                          )}
                        />
                      {/if}
                      <div>
                        {cell.row.original.blankColor || '--'}
                      </div>
                    {/if}
                  </Table.Cell>
                {:else if cell.id === 'heatTransfer'}
                  <Table.Cell {...attrs}>
                    {#if cell.row.isData()}
                      {#if cell.row.original.heatTransfer.code}
                        <div
                          class={cn(
                            'w-fit rounded-lg  px-2 py-1 ',
                            cell.row.original.heatTransfer.isSmall
                              ? 'bg-purple-50 text-purple-800'
                              : 'bg-blue-50 text-blue-800'
                          )}
                        >
                          {cell.row.original.heatTransfer.code}
                        </div>
                      {:else}
                        <div
                          class="w-fit rounded-lg border border-gray-500 px-2 py-1 text-gray-600"
                        >
                          None
                        </div>
                      {/if}
                    {/if}
                  </Table.Cell>
                {:else}
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {/if}
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
