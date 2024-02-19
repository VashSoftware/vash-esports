<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

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

<div class="mb-4">
  <h1>{data.mapPool.name || `Map Pool ${data.mapPool.id}`}</h1>
  <p>{data.mapPool.description}</p>
</div>

<h2>Maps</h2>
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
      </tr>
    </thead>
    <tbody>
      {#each data.mapPool.map_pool_maps as map}
        <tr class="">
          <td>NM1</td>
          <td>{map.maps.osu_id}</td>
          <td
            ><img
              src="https://assets.ppy.sh/beatmaps/{map.maps.mapsets
                .osu_id}/covers/cover@2x.jpg"
              height="32"
              alt="Map Banner"
            /></td
          >
          <td
            >{map.maps.mapsets.artist} - {map.maps.mapsets.title} [{map.maps
              .difficulty_name}]</td
          >
          <td>{map.maps.mapsets.creator}</td>
          <td>{map.maps.star_rating}</td>
          <td>{map.maps.mapsets.bpm}</td>
          <td>{map.maps.mapsets.time}</td>
          <td>{map.maps.circle_size}</td>
          <td>{map.notes}</td>
        </tr>
      {/each}
    </tbody>
  </table>

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
            src="https://assets.ppy.sh/beatmaps/{map.mapsets
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
</div>
