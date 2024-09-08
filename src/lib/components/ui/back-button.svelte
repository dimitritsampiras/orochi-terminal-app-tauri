<!-- back button component -->

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import PhArrowLeft from '~icons/ph/arrow-left';

  export let hardBack: string = '';
</script>

<button
  on:click={() => {
    navigate(hardBack);
  }}
  class="mb-2 flex items-center justify-start gap-2"
  type="button"
>
  <PhArrowLeft class="h-4 w-4" />
  <div>Back</div>
</button>
