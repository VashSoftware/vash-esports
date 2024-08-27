<script lang="ts">
  import { writable } from "svelte/store";
  import MakeMapPoolModal from "$lib/components/makeMapPoolModal.svelte";
  import {
    createColumnHelper,
    createSvelteTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    renderComponent,
    type ColumnDef,
  } from "@tanstack/svelte-table";

  export let data;

  type MapPool = {
    id: number;
    name: string;
    rounds: {
      id: number;
      name: string;
      events: {
        id: number;
        name: string;
        event_groups: {
          id: number;
          name: string;
        };
      };
    };
  };

  const defaultColumns: ColumnDef<MapPool>[] = [
    {
      accessorFn: (row) => {
        if (row.rounds) {
          if (row.rounds.events.event_groups) {
            return `${row.rounds.events.event_groups.name} ${row.rounds.events.name}: ${row.rounds.name}`;
          } else {
            return `${row.rounds.events.name}`;
          }
        } else {
          return row.name;
        }
      },
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => {
        return "6 / 3 / 3 / 3";
      },
      header: "Mod Counts",
      cell: (info) => info.getValue(),
    },
  ];

  const options = writable({
    columns: defaultColumns,
    data: data.mapPools,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageSize: 15,
        pageIndex: 0,
      },
    },
  });

  const table = createSvelteTable(options);

  function setCurrentPage(page: number) {
    options.update((o) => ({
      ...o,
      state: {
        ...o.state,
        pagination: {
          ...o.state.pagination,
          pageIndex: page,
        },
      },
    }));
  }
</script>

<div class="my-5 d-flex justify-content-between align-items-center">
  <h1 class="text-center">Map Pools ({data.mapPools.length})</h1>
  <button
    class="btn btn-lg btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#createMapPoolModal">Create Map Pool</button
  >
</div>

<table class="table-striped table table-hover">
  <thead>
    {#each $table.getHeaderGroups() as headerGroup}
      <tr>
        {#each headerGroup.headers as header}
          <th scope="col" colSpan={header.colSpan}>
            <button
              class="btn btn-dark"
              on:click={header.column.getToggleSortingHandler()}
            >
              <svelte:component
                this={flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              /></button
            >
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each $table.getRowModel().rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <a href={`/map-pools/${row.original.id}`}>
              <svelte:component
                this={flexRender(cell.column.columnDef.cell, cell.getContext())}
              />
            </a>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<div class="d-flex align-items-center justify-content-center">
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage(0)}
    disabled={!$table.getCanPreviousPage()}
  >
    {"<<"}
  </button>
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage($table.getState().pagination.pageIndex - 1)}
    disabled={!$table.getCanPreviousPage()}
  >
    {"<"}
  </button>
  <span> Page </span>
  <input
    class="form-control mx-2"
    type="number"
    value={$table.getState().pagination.pageIndex + 1}
    min={1}
    max={$table.getPageCount()}
    on:change={(e) => setCurrentPage(parseInt(e.target?.value) - 1)}
    style="width: 50px;"
  />
  <span>{" of "}{$table.getPageCount()}</span>
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)}
    disabled={!$table.getCanNextPage()}
  >
    {">"}
  </button>
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage($table.getPageCount() - 1)}
    disabled={!$table.getCanNextPage()}
  >
    {">>"}
  </button>
</div>

<MakeMapPoolModal />
