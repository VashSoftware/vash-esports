<script lang="ts">
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

<form action="?/createMapPool" method="post">
  <div
    class="modal fade"
    id="createMapPoolModal"
    tabindex="-1"
    aria-labelledby="createMapPoolModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Map Pool</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              type="text"
              class="form-control"
              name="name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label
            >
            <textarea
              id="name"
              class="form-control"
              name="description"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Create Map Pool</button>
        </div>
      </div>
    </div>
  </div>
</form>
