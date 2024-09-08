<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { settings } from '$lib/store';
</script>

<h2 class="text-lg font-medium">Settings</h2>


<Label>Path to Arxp files</Label>
<Input bind:value={$settings.arxpPath} />
