<svelte:options accessors />

<script>
  import { ViewContainer } from '@marcellejs/core';

  export let title;
  export let options;
</script>

<ViewContainer {title}>
  <div>This is a <span class="my-color">custom</span> module with the following options:</div>
  <p>{JSON.stringify(options)}</p>
</ViewContainer>

<style>
  .my-color {
    color: seagreen;
  }

</style>
