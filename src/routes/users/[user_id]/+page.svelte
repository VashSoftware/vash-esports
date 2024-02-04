<script lang="ts">
  export let data;
</script>

<div class="row align-items-center py-5">
  <img src="image source" class="img-fluid rounded-top" alt="" />

  <div class="col d-flex align-items-center">
    <img src={data.userPictureUrl} height="128" class="rounded-circle me-4" />
    <div>
      <h1>{data.user?.name}</h1>
      <div class="d-flex gap-2 align-items-center">
        <div>Organisations:</div>
        
        {#each data.organisationPublicUrls as organisation}
          <img height={32} class="rounded" src={organisation.data.publicUrl}>
        {/each}
      </div>
    </div>
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