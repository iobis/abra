<script lang="ts">
  // Draws an Observable Plot chart that fills the width of its container.
  // `options` is a function that receives the width and returns the Plot options.
  import * as Plot from '@observablehq/plot';

  let { options }: { options: (width: number) => Record<string, any> } = $props();

  let width = $state(0);

  // Runs again when the width or anything read by `options` changes
  function draw(node: HTMLElement) {
    if (!width) return;
    const chart = Plot.plot({
      style: { fontFamily: 'inherit', fontSize: '12px', background: 'transparent' },
      ...options(width)
    });
    node.replaceChildren(chart);
    return () => chart.remove();
  }
</script>

<div class="chart" bind:clientWidth={width} {@attach draw}></div>

<style>
  .chart {
    width: 100%;
    min-height: 120px;
  }
</style>
