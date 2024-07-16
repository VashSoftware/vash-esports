<script lang="ts">
  import { writable } from "svelte/store";
  import QuickPlayButton from "$lib/components/quickPlayButton.svelte";
  import {
    createSvelteTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type ColumnDef,
  } from "@tanstack/svelte-table";
  import { goto } from "$app/navigation";

  export let data;

  const defaultColumns: ColumnDef<Event>[] = [
    {
      accessorKey: "rounds.events.name",
      header: "Event",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => new Date(row.start_time).toLocaleString(),
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.match_participants[0]?.participants.teams.name,
      header: "Team 1",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.match_participants[1]?.participants.teams.name,
      header: "Team 2",
      cell: (info) => info.getValue(),
    },
  ];

  const options = writable({
    columns: defaultColumns,
    data: data.matches,
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
  <h1>Matches ({data.matches.length})</h1>

  <div>
    <QuickPlayButton
      supabase={data.supabase}
      ongoingMatch={data.ongoingMatch}
    />
  </div>
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
      <tr role="button" on:click={() => goto(`/matches/${row.original.id}`)}>
        {#each row.getVisibleCells() as cell}
          <td>
            <svelte:component
              this={flexRender(cell.column.columnDef.cell, cell.getContext())}
            />
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
