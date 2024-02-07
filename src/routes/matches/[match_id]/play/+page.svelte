<script lang="ts">
    export let data;
</script>

<div class="my-5">
    <div class="row">
        <div class="col">
            {data.match.id}
        </div>
        <div class="col text-end">
            Team 2
        </div>
    </div>

    <h2>Map pool</h2>
    {#each data.match.rounds.map_pools.map_pool_maps as map}
        {map.maps.mapsets.artist}
    {/each}

</div>