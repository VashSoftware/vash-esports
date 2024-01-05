<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { user } from '../../authStore'

    const logOut = async () => {
        const { error } = await supabase.auth.signOut()
        user.update(null)
    }
</script>

<h1>Account</h1>

Email: stan@stanrunge.dev <button class="btn btn-danger">Change email</button>
<button class="btn btn-danger">Change password</button>

<a href="staff">
    <button class="btn btn-primary">Staff page</button>
</a>
<button on:click={logOut} class="btn btn-danger">Log out</button>

<h3>Purchases (0)</h3>