<script>
  import { page } from "$app/stores";
</script>

<div class="text-center py-4">
  <h1>There's been an error.</h1>
  <p>Error message: {$page.error.message}</p>
</div>
