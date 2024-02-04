<script lang="ts">
  export let data;
</script>

<div class="row align-items-center py-5">
  <img src="image source" class="img-fluid rounded-top" alt="" />

  <div class="col d-flex align-items-center">
    <img src={data.userPictureUrl} height="128" class="rounded-circle me-4" />
    <h1>Stan</h1>
  </div>
  <div class="col">
    <div class="text-end">
      <a
        class="btn btn-primary"
        href="https://osu.ppy.sh/users/11212255"
        role="button">osu! profile</a
      >

      <button class="btn btn-primary"> Discord profile </button>
      <a href="/account" class="btn btn-secondary"> Manage </a>
    </div>
  </div>
</div>

<h2>Organisations ({data.user.organisation_members.length})</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
      </tr>
    </thead>
    <tbody>
      {#each data.user.organisation_members as organisation}
        <tr class="">
          <td>{organisation.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<h2>Organisations ({data.user.organisation_members.length})</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
      </tr>
    </thead>
    <tbody>
      {#each data.user.organisation_members as organisation}
        <tr class="">
          <td>{organisation.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
