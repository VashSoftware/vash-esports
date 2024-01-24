<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
</script>

<h1>osu! Intermediate 2023</h1>

<h2>Registrations</h2>
<h2>Rounds</h2>

<button on:click={() => goto($page.url.pathname + '/edit')}>Edit</button>