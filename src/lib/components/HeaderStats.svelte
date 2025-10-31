<script>
    import { Users, Clock, TrendingUp, DoorOpen, Building } from '@lucide/svelte';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
     import { Button } from "$lib/components/ui/button/index.js";
     import { Badge } from '$lib/components/ui/badge';

    // 1. Declaración de Props
    export let totalAtenciones = 0;
    export let totalEnAtencion = 0;
    export let totalTransacciones = 0;
    export let totalPuestosAbiertos = 0;
    // 🚨 ¡IMPORTANTE! Agregamos los totales de sedes/oficinas que faltaban
    export let totalSedes = 0; 
    export let totalOficinasActivas = 0; 

       // 2. Props de Estado (¡Nuevos!)
    export let isLoading = false;
    export let statusMessage = "Listo para cargar datos.";
    export let statusVariant = "info"; // Usaremos esto para mapear colores
    export let lastUpdateText = "-";

    // 3. Prop de la Función de Carga (¡Nueva!)
    // Esto asegura que al hacer clic en el botón, se ejecute la función del padre.
    export let loadData = () => console.log("Función loadData no proporcionada.");

$: badgeColorClass = {
        'info': 'bg-blue-600 hover:bg-blue-600/90',
        'success': 'bg-emerald-600 hover:bg-emerald-600/90',
        'danger': 'bg-red-600 hover:bg-red-600/90',
        // Si tu tema 'secondary' usa 'info', ajústalo aquí
        'secondary': 'bg-gray-600 hover:bg-gray-600/90', 
    }[statusVariant] || 'bg-gray-500 hover:bg-gray-500/90';
    // 2. Lógica Reactiva interna para el porcentaje (Ahora en el hijo)
    $: porcentajeOficinas = totalSedes > 0 
        ? ((totalOficinasActivas / totalSedes) * 100).toFixed(1) 
        : 0;

    // 3. Array de métricas reactivo ($:) para que se regenere con cada cambio en los props
    $: stats = [
        {
            title: "Personas Atendidas",
            value: totalAtenciones,
            icon: Users,
            color: "text-amber-400",
            unit: ""
        },
        {
            title: "En Atención",
            value: totalEnAtencion,
            icon: Clock,
            color: "text-indigo-400",
            unit: ""
        },
        {
            title: "Transacciones",
            value: totalTransacciones,
            icon: TrendingUp,
            color: "text-sky-400",
            unit: ""
        },
        {
            title: "Puestos Abiertos",
            value: totalPuestosAbiertos,
            icon: DoorOpen,
            color: "text-emerald-400",
            unit: ""
        },
        {
            // Ahora usa la variable reactiva calculada
            title: "Oficinas Activas",
            value: porcentajeOficinas, 
            icon: Building,
            color: "text-blue-500",
            unit: "%"
        },
    ];
</script>
<div class="w-full bg-gray-900 text-white shadow-xl overflow-hidden">
    
    <div class="flex divide-x divide-slate-800">

        <div class="flex flex-col justify-center p-2 min-w-40 max-w-60 flex-shrink-0">
            <div class="mb-1">
                <span class="text-xs font-semibold text-slate-400">Estado: </span>
                <Badge class="h-auto px-1.5 py-0.5 text-xs font-semibold {badgeColorClass} text-white transition-colors duration-150">
                    {statusMessage}
                </Badge>
            </div>
            
            <span class="text-2xs text-slate-500 block mb-2">
                Última Actualización: {lastUpdateText}
            </span>

            <Button
                onclick={loadData}
                disabled={isLoading}
                size="xs"
                variant="destructive"
                id="reloadButton"
                class="w-full"
            >
                {#if isLoading}
                    Cargando...
                {:else}
                    Recargar Datos
                {/if}
            </Button>
        </div>

        <div class="flex-grow flex divide-x-2 divide-slate-700">
    {#each stats as stat}
        <div class="flex-1 p-2 flex items-center justify-start min-w-0 hover:bg-slate-800/50 transition-colors duration-200">
            <div class="flex-shrink-0 mr-3">
                <svelte:component this={stat.icon} class="size-8 {stat.color}" />
            </div>
            
            <div class="flex flex-col items-start">
                <div class="text-xs font-medium uppercase text-slate-400 truncate">
                    {stat.title}
                </div>
                <div class="text-3xl font-extrabold leading-none">
                    {stat.value}{stat.unit}
                </div>
            </div>
        </div>
    {/each}
</div>
        
    </div>
</div>