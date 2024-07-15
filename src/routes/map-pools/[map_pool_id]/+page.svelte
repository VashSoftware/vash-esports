<script lang="ts">
  import { enhance } from "$app/forms";
  import DropdownSearch from "$lib/components/dropdownSearch.svelte";
  import MapPoolMapRemoveButton from "./MapPoolMapRemoveButton.svelte";
  import MapPoolModAddButton from "./MapPoolModAddButton.svelte";
  import {
    createColumnHelper,
    createSvelteTable,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    renderComponent,
    type ColumnDef,
  } from "@tanstack/svelte-table";
  import { writable } from "svelte/store";

  export let data;

  type MapPoolMap = {
    id: number;
    map_pool_id: number;
    map_id: number;
    mod_priority: number;
    map_pool_map_mods: { mod_id: number; mods: { id: number; code: string } }[];
    maps: {
      mapsets: {
        artist: string;
        title: string;
      };
    };
  };

  const columnHelper = createColumnHelper<MapPoolMap>();

  const defaultColumns: ColumnDef<MapPoolMap>[] = [
    columnHelper.display({
      id: "actions",
      header: "Add Map",
      cell: (props) => {
        return props.row.original.mod_priority == 1
          ? renderComponent(MapPoolModAddButton, {
              modId: props.row.original.map_pool_map_mods[0].mod_id,
              modPriority:
                data.mapPool.map_pool_maps.filter(
                  (map) =>
                    map.map_pool_map_mods[0].mod_id ==
                    props.row.original.map_pool_map_mods[0].mod_id
                ).length + 1,
            })
          : "";
      },
    }),
    {
      accessorFn: (row) =>
        `${row.map_pool_map_mods.map((mod) => (mod.mods.code != null ? mod.mods.code : "NM"))}${row.mod_priority}`,
      header: "Mod ID",
      cell: (info) => info.getValue(),
    },
    columnHelper.display({
      id: "map",
      header: "Map",
      cell: (props) =>
        renderComponent(DropdownSearch, {
          text: props.row.original.maps
            ? `${props.row.original.maps.mapsets.artist} - ${props.row.original.maps.mapsets.title}`
            : "No map selected",
          searchKey: "maps",
          selectKey: "id, mapsets(artist, title)",
          searchColumn: "mapsets.title",
          itemDisplayFn: (item) =>
            item.mapsets
              ? `${item.mapsets?.artist} - ${item.mapsets?.title}`
              : "",
          supabase: data.supabase,
          selectRowFn: async (item) => {
            await data.supabase
              .from("map_pool_maps")
              .update({
                map_id: item.id,
              })
              .eq("id", props.row.original.id)
              .select("*");
          },
          searchFn: async (event) => {
            fetch(`/api/maps`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ search: event.target.value }),
            });

            return;
          },
        }),
    }),
    {
      accessorKey: "maps.star_rating",
      header: "Star Rating",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => {
        const minutes = Math.floor(row.maps?.mapsets.time / 60);
        const seconds = row.maps?.mapsets.time % 60;
        return isNaN(minutes) || isNaN(seconds)
          ? ""
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;
      },
      header: "Length",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "maps.mapsets.bpm",
      header: "BPM",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "maps.circle_size",
      header: "Circle Size",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "maps.overall_difficulty",
      header: "Overall Difficulty",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "maps.approach_rate",
      header: "Approach Rate",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: (info) => info.getValue(),
    },
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => {
        return renderComponent(MapPoolMapRemoveButton, {
          mapPoolMapId: props.row.original.id,
        });
      },
    }),
  ];

  const options = writable({
    columns: defaultColumns,
    data: data.mapPool.map_pool_maps,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const table = createSvelteTable(options);

  async function getMap(id) {
    const response = await fetch(`/api/maps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();

    return data;
  }

  let timer;
  function debounce(event) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const formData = new FormData(event.target);
      const osuId = formData.get("osu-id");
      const mapI = formData.get("map-pool-map-i");
      const modI = formData.get("map-pool-mod-i");

      let map = await getMap(osuId);
      data.mapPool.map_pool_mods[modI].map_pool_maps[mapI].found_maps = [map];
    }, 300);
  }

  async function deletePool(event: Event) {
    await data.supabase
      .from("map_pools")
      .update({
        deleted_at: new Date(),
      })
      .eq("id", data.mapPool.id);

    window.location.href = "/map-pools";
  }

  let addModForm;
</script>

<a href="/map-pools" type="button" class="btn btn-secondary my-4"
  >{"<"} Back to Map Pools</a
>

<div class="mb-4 d-flex align-items-center justify-content-between">
  <div>
    <h1>{data.mapPool.name || `Map Pool ${data.mapPool.id}`}</h1>
    <p>{data.mapPool.description || ""}</p>
  </div>
  <div>
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#editMapPoolModal">Settings</button
    >
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

<div class="d-flex justify-content-center mb-5">
  <div>
    <form
      bind:this={addModForm}
      action="?/addMapPoolMod"
      method="post"
      use:enhance
    >
      <DropdownSearch
        text="Add Mod"
        searchKey="mods"
        selectKey="id, name"
        supabase={data.supabase}
        itemDisplayFn={(item) => item.name}
        searchColumn="name"
        selectRowFn={(item) => {
          addModForm.querySelector("input[name=mods]").value = item.id;

          addModForm.submit();
        }}
        filters={[
          (item) => {
            return !data.mapPool.map_pool_maps.some(
              (map) => map.map_pool_map_mods[0].mod_id === item.id
            );
          },
        ]}
      />
    </form>
  </div>
</div>

<form action="?/editMapPool" method="post">
  <div
    class="modal fade"
    id="editMapPoolModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Edit {data.mapPool?.name || `Map Pool ${data.mapPool.id}`}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <h2>Information</h2>
            <label
              for="mapPoolName"
              class="form-label

              ">Map Pool Name</label
            >
            <input
              type="text"
              class="form-control"
              id="mapPoolName"
              name="name"
              value={data.mapPool.name}
            />

            <label
              for="mapPoolDescription"
              class="form-label

              ">Map Pool Description</label
            >
            <textarea
              class="form-control"
              id="mapPoolDescription"
              name="description">{data.mapPool.description}</textarea
            >

            <h2>Maps</h2>
          </div>

          <div class="mb-3 d-flex justify-content-between align-items-center">
            <b>Delete Pool?</b>

            <button type="button" class="btn btn-danger" on:click={deletePool}>
              Delete
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</form>
