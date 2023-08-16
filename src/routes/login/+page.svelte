<script lang="ts">
    import type { PageData } from './$types'
    import { superForm } from 'sveltekit-superforms/client'

    export let data: PageData

    const { form } = superForm(data.form)
</script>

<h1>Login</h1>

<form method="POST">
    <label for="email">Email</label>
    <input type="email" name="email" bind:value={$form.name} />

    <label for="password">Password</label>
    <input type="password" name="password" bind:value={$form.password} />

    <button class="btn btn-primary">Log in</button>
</form>