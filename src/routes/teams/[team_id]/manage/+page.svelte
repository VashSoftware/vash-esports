<script lang="ts">
    export let data;
</script>

<div class="py-5 text-center">
    <h1>Manage {data.team.name}</h1>
</div>

<form method="post" enctype="multipart/form-data">
    <label>
        <input type="text" name="name" value={data.team.name} />
    </label>
    <label>
        <input type="file" name="icon" accept="image/*" />
    </label>

    <button type="submit">Save Changes</button>
</form>