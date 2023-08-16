<script lang="ts">
    import { browser } from '$app/environment'
    import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
    import { createClient } from '@supabase/supabase-js'

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser
            }
        }
    })

    const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
    )
</script>

<div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg bg-dark-subtle">
        <div class="container">
            <a class="navbar-brand" href="/">Vash</a>
            <div class="ms-auto">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/events">Events</a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link" href="/account">Account</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container ">
        <QueryClientProvider client={queryClient}>
            <slot />
        </QueryClientProvider>
    </div>

    <footer class="container-fluid mt-auto bg-dark-subtle">
        <div class="row justify-content-center">
            <div class="col text-center">
                <a class="col text-decoration-none" href="https://vashsoftware.postman.co/workspace/Team-Workspace~3d9897d9-a60b-42ee-8e50-2fbf27001699/api/55de769d-5678-4094-998c-91a94f50432c?action=share&creator=23593352">API</a>
                •
                <a class="col text-decoration-none" href="/terms">Terms</a>
                •
                <a class="col text-decoration-none" href="/privacy">Privacy</a>
                •
                <a class="col text-decoration-none" href="/wiki">Wiki</a>
                •
                <a class="col text-decoration-none" href="/status">Status</a>
            </div>
        </div>
        <p class="text-center">Made by <a href="https://github.com/VashSoftware">Vash Software</a></p>
    </footer>
</div>