<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';

  import AssemblyLine from './routes/assembly-line/assembly-line.svelte';
  import { cn } from '$lib/utils';

  import AssemblyItemLoad from './routes/assembly-item/assembly-item-load.svelte';

  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { Toaster } from 'svelte-sonner';
  import Settings from './routes/settings/settings.svelte';

  const queryClient = new QueryClient();

  export let url = '';
</script>

<Toaster position="top-right" richColors />
<QueryClientProvider client={queryClient}>
  <main class="bg-gray-50 min-h-lvh">
    <Router {url}>
      <nav class="flex items-center space-x-4 lg:space-x-6 bg-white border-b p-3">
        <Link to="/" let:active>
          <span class={cn(!active && 'text-gray-600', 'hover:cursor-pointer')}>Assembly</span>
        </Link>
        <Link to="/settings" let:active>
          <span class={cn(!active && 'text-gray-600', 'hover:cursor-pointer')}>Settings</span>
        </Link>
      </nav>
      <div class="p-6">
        <Route path="/">
          <AssemblyLine />
        </Route>

        <Route path="/:itemId" let:params>
          <AssemblyItemLoad itemId={params.itemId} />
        </Route>

        <Route path="/settings">
          <Settings />
        </Route>
      </div>
    </Router>
  </main>
</QueryClientProvider>
