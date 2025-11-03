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
</svelte:head>

{@render children?.()}
