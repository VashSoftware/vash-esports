<script lang="ts">
  import Layout from "../../+layout.svelte";

  export let data;
</script>

<h1>Create Event</h1>
<p>Before we create your event, we need some information.</p>

<form method="post">
  <label>
    Organisation:
    <select name="organisation-id">
      {#each data.organisations as organisation}
        <option value={organisation.id}>{organisation.name}</option>
      {/each}
    </select>
  </label>

  <label for="event-title"
    >Event Title:
    <input type="text" name="event-title" />
  </label>

  <button type="submit">Create Event</button>
</form>
