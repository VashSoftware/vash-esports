<script>
  import { enhance } from "$app/forms";

  export let mapPoolMapId;
</script>

<form action="?/removeMapPoolMap" method="post">
  <input type="hidden" name="map-pool-map-id" value={mapPoolMapId} />
  <div class="text-center">
    <button type="submit" class="btn btn-danger">-</button>
  </div>
</form>
