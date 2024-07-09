<script lang="ts">
  import MakeMapPoolModal from "../../components/makeMapPoolModal.svelte";

  export let data;
</script>

<div class="d-flex justify-content-between align-items-center">
  <div></div>
  <h1 class="my-5 text-center">Map Pools ({data.mapPools.length})</h1>
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#createMapPoolModal">Create Map Pool</button
  >
</div>

{#each data.mapPools as mapPool}
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{mapPool.name}</h5>
      <p class="card-text">{mapPool.description}</p>
      <a href="/map-pools/{mapPool.id}" class="btn btn-primary">View</a>
    </div>
  </div>
{/each}

<MakeMapPoolModal />
