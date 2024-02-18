<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

  let newMap = null;

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
          <td
            >{map.maps.circle_size} | {newMap?.maps.approach_rate} |
            {newMap?.maps.overall_difficulty}</td
          >
          <td>{map.notes}</td>
        </tr>
      {/each}
      <tr class="">
        <td></td>
        <td
          ><form action="?/addMap" method="post" use:enhance>
            <input
              type="text"
              class="form-control-plaintext"
              placeholder="Enter osu! map ID / link"
              on:input={debounce}
            />
          </form>
        </td>
        <td
          >{#if newMap}
            <img
              src="https://assets.ppy.sh/beatmaps/{1}/covers/cover@2x.jpg"
              height="32"
              alt="Map Banner"
            />
          {/if}
        </td>
        <td
          >{#if newMap}{newMap?.maps.mapsets.artist} - {newMap?.maps.mapsets
              .title} [{newMap?.maps.difficulty_name}]{/if}</td
        >
        <td
          >{#if newMap}{newMap?.maps.mapper_name}{/if}</td
        >
        <td
          >{#if newMap}{newMap?.maps.star_rating}{/if}</td
        >
        <td
          >{#if newMap}{newMap?.maps.mapsets.bpm}{/if}</td
        >
        <td
          >{#if newMap}{newMap?.maps.mapsets.time}{/if}</td
        >
        <td
          >{#if newMap}{newMap?.maps.circle_size} | {newMap?.maps.approach_rate}
            |
            {newMap?.maps.overall_difficulty}{/if}</td
        >
        <td
          >{#if newMap}{newMap?.notes}{/if}</td
        >
      </tr>
    </tbody>
  </table>
</div>
