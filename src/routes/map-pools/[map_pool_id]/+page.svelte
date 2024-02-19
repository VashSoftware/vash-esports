<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
  console.log(data);

  let found_maps = [];
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
      let map = await getMap(event.target.value);
      console.log(map);
      found_maps = [map];
    }, 200);
  }
</script>

<a href="/map-pools" type="button" class="btn btn-secondary my-4"
  >{"<"} Back to Map Pools</a
>

<div class="mb-4 d-flex align-items-center justify-content-between">
  <div>
    <h1>{data.mapPool.name || `Map Pool ${data.mapPool.id}`}</h1>
    <p>{data.mapPool.description}</p>
  </div>
  <div>
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#editMapPoolModal">Edit Data</button
    >
  </div>
</div>

{#each data.mapPool.map_pool_mods as mod}
  <div class="row align-items-center">
    <div class="col-2"><h2>{mod.name}</h2></div>
    <div class="col">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Pool ID</th>
              <th>osu! ID</th>
              <th>Banner</th>
              <th>Artist - Title [Difficulty]</th>
              <th>Mapper</th>
              <th>Star Rating</th>
              <th>BPM</th>
              <th>Time</th>
              <th>CS</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each mod.map_pool_maps as map}
              <tr class="">
                <td>{mod.code}{map.mod_priority}</td>
                <td>{map.maps?.osu_id}</td>
                <td
                  ><img
                    src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                      .osu_id}/covers/cover@2x.jpg"
                    height="32"
                    alt="Map Banner"
                  /></td
                >
                <td
                  >{map.maps?.mapsets.artist} - {map.maps?.mapsets.title} [{map
                    .maps?.difficulty_name}]</td
                >
                <td>{map.maps?.mapsets.creator}</td>
                <td>{map.maps?.star_rating}</td>
                <td>{map.maps?.mapsets.bpm}</td>
                <td>{map.maps?.mapsets.time}</td>
                <td>{map.maps?.circle_size}</td>
                <td>{map.notes}</td>
                <td></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/each}

<input
  type="text"
  class="form-control"
  placeholder="Enter osu! map ID / link"
  on:input={debounce}
/>

{#if found_maps.length > 0}
  <h2 class="mt-3">Found Maps:</h2>
{/if}

<div class="row row-cols-4 gap-3 mx-0">
  {#each found_maps as map}
    <form class="col" action="?/addMap" method="post" use:enhance>
      <input type="hidden" name="mapId" value={map.id} />

      <div class="card py-3">
        <img
          src="https://assets.ppy.sh/beatmaps/{map?.mapsets
            .osu_id}/covers/cover.jpg"
          class="card-img-top"
          alt="Map Banner"
        />
        <div class="card-body">
          <h5 class="card-title">
            {map.mapsets.artist} - {map.mapsets.title}
          </h5>
          <p class="card-text">
            Mapped by {map.mapsets.creator}
          </p>
          <div class="d-flex gap-3">
            <textarea name="notes" class="form-control" placeholder="Notes" />
            <div class="mb-3">
              <label for="" class="form-label">Mod ID</label>
              <select class="form-select form-select-lg" name="" id="">
                {#each data.mapPool.map_pool_mods as mod}
                  <option value={mod.id}>{mod.name}</option>
                {/each}
              </select>
            </div>

            <button type="submit" class="btn btn-primary"
              >Add to Map Pool</button
            >
          </div>
        </div>
      </div>
    </form>
  {/each}
</div>

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
          Edit {data.mapPool.name || `Map Pool ${data.mapPool.id}`}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <form action="?/editMapPool" method="post" use:enhance>
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
            <div class="row">
              {#each data.mapPool.map_pool_mods as mod}
                <div class="col col-3">
                  <label for="mapPoolMod" class="form-label">{mod.code}</label>
                  <input
                    type="number"
                    class="form-control"
                    id="mapPoolMaps"
                    name="maps"
                    value={mod.map_pool_maps.length}
                  />
                </div>
              {/each}
            </div>
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
      </form>
    </div>
  </div>
</div>
