<script>
  import { enhance } from "$app/forms";

  export let modPriority;
  export let modId;
</script>

<form action="?/addMapPoolMapMod" method="post">
  <input type="hidden" name="mod-priority" value={modPriority} />
  <input type="hidden" name="mod-id" value={modId} />

  <div class="text-center">
    <button type="submit" class="btn btn-primary">+</button>
  </div>
</form>
