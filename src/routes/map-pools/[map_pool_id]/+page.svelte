<script lang="ts">
  export let data;
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
        <th>Banner</th>
        <th>Artist - Title [Difficulty]</th>
        <th>Mapper</th>
        <th>Star Rating</th>
        <th>BPM</th>
        <th>Time</th>
        <th>CS</th>
        <th>AR</th>
        <th>OD</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each data.mapPool.map_pool_maps as map}
        <tr class="">
          <td><img src="https://assets.ppy.sh/beatmaps/{map.maps.mapsets.osu_id}/covers/cover@2x.jpg" height="32" alt="Map Banner" /></td>
          <td>{map.maps.mapsets.artist} - {map.maps.mapsets.title} [{map.maps.difficulty_name}]</td>
          <td>{map.maps.mapper_name}</td>
          <td>{map.maps.star_rating}</td>
          <td>{map.maps.mapsets.bpm}</td>
          <td>{map.maps.mapsets.time}</td>
          <td>{map.maps.circle_size}</td>
          <td>{map.maps.approach_rate}</td>
          <td>{map.maps.overall_difficulty}</td>
          <td>{map.notes}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="text-center">
  <h3>Add Map</h3>
  <form method="post">
    <label for="mapId" class="form-label">Map ID</label>
    <input class="form-control" name="mapId" type="text" />

    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</div>
