<script lang="ts">
    import { createQuery} from "@tanstack/svelte-query";

    const Event = {

    }

    // const query = createQuery<>({})
</script>

<div class="row">
    <div class="col-10">
        <h1>Events</h1>
    </div>
    <div class="col-2">
        <a class="disabled" href="/events/create">
            <button class="btn btn-primary disabled">
                Create Event
            </button>
        </a>
    </div>
</div>

<table class="table table-striped">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Registrations</th>
            <th scope="col">Register</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>osu! Beginner 2023</td>
            <td>0/256</td>
            <td>
                <button class="btn btn-primary">Register</button>
            </td>
        </tr>
        <tr>
            <td>2</td>
            <td>osu! Intermediate 2023</td>
            <td>0/128</td>
            <td>
                <button class="btn btn-primary">Register</button>
            </td>
        </tr>
        <tr>
            <td>3</td>
            <td>osu! Advanced 2023</td>
            <td>0/64</td>
            <td>
                <button class="btn btn-primary">Register</button>
            </td>
        </tr>
        <tr>
            <td>4</td>
            <td>osu! Open 2023</td>
            <td>0/32</td>
            <td>
                <button class="btn btn-primary">Register</button>
            </td>
        </tr>
    </tbody>
</table>