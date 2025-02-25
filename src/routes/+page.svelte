<script lang="ts">
  import GameBoard from "./GameBoard/GameBoard.svelte";
  import GameSettings from "./GameSettings/GameSettings.svelte";
  import { s } from "./states/states.svelte";
</script>

<div class="component">
  {#if s.view === "game"}
    <GameBoard />
  {:else}
    <GameSettings />
  {/if}
</div>

<style>
</style>
