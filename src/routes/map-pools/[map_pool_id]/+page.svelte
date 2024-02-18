<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

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
    }, 250);
  }
</script>

<div class="my-5">
  <h1>Map Pool 1</h1>
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
          <td>{map.maps.mapper_name}</td>
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

  <form action="?/addMap" method="post" use:enhance>
    <input type="hidden" name="mapId" value="2">
    
    <div class="card my-3" style="width: 18rem;">
      <img
        src="https://assets.ppy.sh/beatmaps/601135/covers/cover@2x.jpg"
        class="card-img-top"
      />
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <button type="submit" class="btn btn-primary">Add to Map Pool</button>
      </div>
    </div>
  </form>
</div>
