<script lang="ts">
    export let data;
</script>

<div class="row align-items-center">
  <img
    src="image source"
    class="img-fluid rounded-top"
    alt=""
  />
  
  
    <div class="col">
    <h1>Stan</h1>
  </div>
  <div class="col">
    <div class="text-end">
        <a
            id=""
            class="btn btn-primary"
            href="https://osu.ppy.sh/users/11212255"
            role="button"
            >osu! profile</a
        >
        
      <button class="btn btn-primary"> Discord profile </button>
    </div>
  </div>
</div>

<h3>Organisations ({data.organisations.length})</h3>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
      </tr>
    </thead>
    <tbody>
        {#each data.organisations as organisation}
        <tr class="">
            <td>{organisation.name}</td>
          </tr>
        {/each}
    </tbody>
  </table>
</div>