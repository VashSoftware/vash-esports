<script>
  import { enhance } from "$app/forms";
  export let mods;
  export let mapPoolMap;
</script>

<div class="d-flex gap-1 text-center">
  <form
    action="?/editMod"
    method="post"
    on:change={(e) => {
      e.currentTarget.requestSubmit();
    }}
  >
    <input type="hidden" name="map-pool-map-id" value={mapPoolMap.id} />
    <select name="mod-id" class="form-select me-4">
      {#each mods as mod}
        <option
          value={mod.id}
          selected={mod.id == mapPoolMap.map_pool_map_mods[0]?.mods.id}
        >
          {mod.code || "NM"}
        </option>
      {/each}
    </select>
  </form>

  <form
    action="?/editModPriority"
    method="post"
    on:change={(e) => {
      e.currentTarget.requestSubmit();
    }}
  >
    <input type="hidden" name="map-pool-map-id" value={mapPoolMap.id} />
    <input
      type="number"
      name="mod-priority"
      class="form-control me-5"
      value={mapPoolMap.mod_priority}
    />
  </form>
</div>
