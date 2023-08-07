<main class="container">
    <h1>osu! Intermediate 2023</h1>
    <form on:submit={submitForm}>
        <input id="osuId" type="number" placeholder="osu! ID" />
        <input id="email" type="email" placeholder="Email"/>
        <button type="submit">Register</button>
    </form>
</main>

<script lang="ts">
    import "@picocss/pico";
    import axios from "axios";

    async function submitForm(e: Event) {
        e.preventDefault();

        const osuId = Number.parseInt((<HTMLInputElement>document.getElementById("osuId")).value);
        const email = (<HTMLInputElement>document.getElementById("email")).value;
        
        const response = await axios.post("http://localhost:3000/registrations", {
            "osuId": osuId,
            "email": email
        })

        console.log(response)        
    }
</script>