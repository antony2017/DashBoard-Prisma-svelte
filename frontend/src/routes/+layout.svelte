<script>
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    
    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <title>Dashboard de Monitoreo</title>
    <meta name="description" content="Dashboard de Monitoreo PTC" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
</svelte:head>

{@render children?.()}
