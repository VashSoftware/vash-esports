<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Account</h1>

Email: stan@stanrunge.dev<button class="btn btn-danger">Change email</button>
<button class="btn btn-danger">Change password</button>

<a href="staff">
  <button class="btn btn-primary">Staff page</button>
</a>
<form method="POST">
  <button type="submit" class="btn btn-danger">Log out</button>
</form>


<h3>Purchases (0)</h3>
