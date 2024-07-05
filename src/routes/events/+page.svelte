<script lang="ts">
  import { goto } from "$app/navigation";
  import { tooltip } from "$lib/bootstrapTooltip";
  import { writable } from "svelte/store";
  import RegisterButton from "../../components/registerButton.svelte";
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

  type Event = {
    id: number;
    created_at: Date;
    name: string;
    game_id: number;
    organisations: { name: string };
    event_options: { max_registrations: number };
    event_groups: { name: string };
    event_status_id: number;
    description: string;
    quick_event: boolean;
    participants: { length: number };
  };

  const columnHelper = createColumnHelper<Event>();

  const defaultColumns: ColumnDef<Event>[] = [
    {
      accessorKey: "organisations.name",
      header: "Organisation",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.participants.length,
      header: "Registrations",
      cell: (info) => info.getValue(),
    },
    columnHelper.display({
      id: "actions",
      header: "Register",
      cell: (props) =>
        renderComponent(RegisterButton, {
          event: props.row.original,
          teams: data.teams,
        }),
    }),
  ];

  const options = writable({
    columns: defaultColumns,
    data: data.events,
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

<div class="row py-5">
  <div class="col">
    <h1>Events ({data.eventsCount})</h1>
  </div>
  <div class="col text-end">
    <button
      data-bs-toggle="modal"
      data-bs-target="#createEventModal"
      class="btn btn-success btn-lg"
    >
      Create Event
    </button>
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
      <tr>
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
    min={0}
    max={$table.getPageCount() - 1}
    on:change={(e) => setCurrentPage(parseInt(e.target?.value) - 1)}
    style="width: 50px;"
  />
  <span>{" of "}{$table.getPageCount()}</span>
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)}
    disabled={!$table.getCanPreviousPage()}
  >
    {">"}
  </button>
  <button
    class="btn btn-dark"
    on:click={() => setCurrentPage($table.getPageCount() - 1)}
    disabled={!$table.getCanPreviousPage()}
  >
    {">>"}
  </button>
</div>

<form action="?/createEvent" method="post">
  <div
    class="modal fade"
    id="createEventModal"
    tabindex="-1"
    aria-labelledby="createEventModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Event</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="organisation-id" class="form-label">Organisation</label>
            <select
              class="form-select"
              aria-label="Default select example"
              name="organisation-id"
            >
              {#each data.organisations as organisation}<option
                  value={organisation.id}>{organisation.name}</option
                >{/each}
            </select>
          </div>

          <div class="mb-3">
            <label for="event-group-id" class="form-label">Event Group</label>
            <select
              class="form-select"
              aria-label="Default select example"
              name="event-group-id"
            >
              <option>None</option>
              {#each data.eventGroups as eventGroup}<option
                  value={eventGroup.id}>{eventGroup.name}</option
                >{/each}
            </select>
          </div>

          <label for="game-id" class="form-label">Game</label>
          <div class="input-group mb-3">
            <label class="input-group-text" for="game-id"
              ><img
                height="32"
                src={data.games[0].logo}
                alt="Game icon"
              /></label
            >
            <select
              use:tooltip
              name="game-id"
              class="form-select"
              id="game-id"
              disabled
              data-bs-title="More games coming soon"
            >
              {#each data.games as game}
                <option value={game.id}>{game.name}</option>
              {/each}
            </select>
          </div>

          <div class="mb-3">
            <label for="event-name" class="form-label">Name</label>
            <input
              id="event-name"
              type="text"
              class="form-control"
              name="event-name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="event-description" class="form-label">Description</label
            >
            <textarea
              id="event-name"
              class="form-control"
              name="event-description"
            />
          </div>

          <div class="form-text">
            We'll need more configuration later to start the event.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Create Event</button>
        </div>
      </div>
    </div>
  </div>
</form>
