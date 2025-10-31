<script>
import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
import { Users, Clock, TrendingUp, DoorOpen, Building } from '@lucide/svelte';
import { Badge } from '$lib/components/ui/badge';
    import Chart from "chart.js/auto"; // Importa la clase Chart
    import ChartDataLabels from "chartjs-plugin-datalabels"; // Importa el plugin
    import { onMount } from "svelte";

// 1. Declaración de Props

export let isLoading = false;
export let countrySummaries = [];
 let chartCanvas = null;
  let sedesChartInstance = null;
export let totalSedes = null;
export let totalOficinasActivas = null;
export let totalOficinasInactivas = null;
export let totalSedesDistribuidas = null;
export let totalSedesCentral = null;
  // 🚨 3. FUNCIÓN renderChart (Se mantiene igual) 🚨
    const renderChart = (stats) => {
    if (!Chart || !ChartDataLabels) return; // Validación de seguridad
        
        // 2. REGISTRAR EL PLUGIN LOCALMENTE (Necesario para Chart.js)
        Chart.register(ChartDataLabels);

        if (!chartCanvas) {
            console.error("El elemento <canvas> no ha sido enlazado correctamente en ContentStats.");
            return;
        }

        if (sedesChartInstance) {
            sedesChartInstance.destroy();
        }

        sedesChartInstance = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: [
                    "Total Sedes",
                    "Activas",
                    "Inactivas",
                    "Distribuidas",
                    "Centrales",
                ],
                datasets: [
                    {
                        label: "Cantidad",
                        data: [
                            stats.totalSedes,
                            stats.totalOficinasActivas,
                            stats.totalOficinasInactivas,
                            stats.totalSedesDistribuidas,
                            stats.totalSedesCentral,
                        ],
                        backgroundColor: [
                            "rgba(59, 130, 246, 0.5)",
                            "rgba(16, 185, 129, 0.5)",
                            "rgba(239, 68, 68, 0.5)",
                            "rgba(34, 211, 238, 0.5)",
                            "rgba(139, 92, 246, 0.5)",
                        ],
                        borderColor: [
                            "#3B82F6",
                            "#10B981",
                            "#EF4444",
                            "#22D3EE",
                            "#8B5CF6",
                        ],
                        borderWidth: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, labels: { color: "#F9FAFB" } },
                    tooltip: { enabled: true },
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        color: "#F9FAFB",
                        font: { weight: "bold" },
                        formatter: (value) => (value > 0 ? value : ""),
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#F9FAFB" },
                        grid: { color: "#374151" },
                    },
                    x: {
                        ticks: { color: "#F9FAFB" },
                        grid: { display: false },
                    },
                },
            },
        });
    };


    $: if (
     chartCanvas &&
        !isLoading &&
        totalSedes !== null && // Usamos 'null' para la verificación inicial
        totalSedes > 0 &&
        (totalOficinasActivas > 0 || totalOficinasInactivas > 0)
    ) {
        renderChart({
            totalSedes: totalSedes,
            totalOficinasActivas: totalOficinasActivas,
            totalOficinasInactivas: totalOficinasInactivas,
            totalSedesDistribuidas: totalSedesDistribuidas,
            totalSedesCentral: totalSedesCentral,
        });
    }

    

</script>
<div id="results" class="p-2 bg-slate-950 min-h-screen">
    {#if isLoading && countrySummaries.length === 0}
        <div
            class="p-4 text-center bg-blue-800/50 text-blue-300 rounded-lg shadow-xl mt-2 border border-blue-700/50"
        >
            <span class="text-lg font-semibold">
                Cargando datos. Por favor, espere...
            </span>
        </div>
    {:else if countrySummaries.length === 0}
        <div
            class="p-4 text-center bg-amber-800/50 text-amber-300 rounded-lg shadow-xl mt-2 border border-amber-700/50"
        >
            <span class="text-lg font-semibold">
                No hay resultados de oficinas activas para mostrar. 😔
            </span>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-5 gap-2 h-[calc(100vh-1rem)]">
            
            <div class="h-full col-span-1">
                <Card class="h-full shadow-2xl border-0 bg-slate-900 text-white border border-slate-700/50">
                    <CardHeader class="p-2 border-b border-slate-700">
                        <CardTitle class="text-md font-extrabold text-sky-400">
                            Resumen Sedes 📊
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent
                        class="flex flex-col justify-around p-1"
                        style="height: calc(100% - 50px);"
                    >
                        <div class="w-full h-1/2 flex items-center justify-center p-1 border-b border-slate-800/50">
                            <div class="w-full h-full">
                                <canvas bind:this={chartCanvas} id="sedesChart"></canvas>
                            </div>
                        </div>

                        <div class="w-full h-1/2 flex items-center justify-center p-1">
                            <div class="text-slate-500 text-sm italic p-4 border border-dashed border-slate-700 rounded-md">
                                Espacio reservado para el Segundo Gráfico.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="col-span-1 md:col-span-4 overflow-y-auto h-full pr-1 custom-scrollbar">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    
                    {#each countrySummaries as summary (summary.country)}
                        <div class="country-group border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-xl">
                            
<CardHeader class="py-1.5 px-3 bg-slate-800 border-b border-yellow-500/50">
<CardTitle
    class="text-lg font-bold text-white leading-tight flex justify-between items-center"
    >
    <span class="text-white">
        {summary.country} ({summary.branches.length} Sedes)
    </span>
    <span class="text-base font-extrabold text-slate-900 bg-amber-400 px-3 py-1.5 rounded-full shadow-lg">
        Atendidos: {summary.totalCustomersServed}
    </span>
</CardTitle>
</CardHeader>

<CardContent class="p-0">
    {#each summary.branches.filter((b) => b.totalOpenServicePoints > 0 || b.totalCustomersServed > 0 || b.totalNumberOfTransactions > 0) as branch (branch.country + "-" + branch.branchId + "-" + branch.servidor)}
        <div
            class={`
                p-2 border-b border-slate-800 transition-all hover:bg-slate-800/70
                ${branch.central === "Central" ? 'bg-blue-900/40' : 'bg-slate-800/40'}
            `}
        >
            <div class="flex flex-col">
                
                <div class="flex justify-between items-start mb-1.5">
                    <strong class="text-white font-semibold leading-tight"> 
                        {branch.branchName}
                    </strong>
                    <div class="flex-shrink-0 flex space-x-1">
                        <Badge
                            variant="default"
                            class="bg-blue-700 text-xs h-5 px-2 leading-none self-center" 
                        >
                            {branch.serverName}
                        </Badge>
                        <Badge
                            variant="secondary"
                            class="text-cyan-300 bg-cyan-900/50 text-xs h-5 px-2 leading-none self-center"
                        >
                            {branch.central}
                        </Badge>
                        <Badge
                            variant="secondary"
                            class="text-cyan-300 bg-cyan-900/50 text-xs h-5 px-2 leading-none self-center"
                        >
                            {branch.servidor}
                        </Badge>
                    </div>
                </div>

                <div
                    class="grid grid-cols-4 justify-items-center text-white text-xs divide-x divide-slate-700/50"
                >
                    <div class="flex flex-col items-center py-1 px-0.5">
                        <DoorOpen class="size-6 text-emerald-400" /> 
                        <span class="font-extrabold text-xl leading-tight mt-0.5"> 
                            {branch.totalOpenServicePoints}
                        </span>
                        <div class="text-sm text-white leading-none">
                            Abiertos
                        </div>
                    </div>

                    <div class="flex flex-col items-center py-1 px-0.5">
                        <Users class="size-6 text-amber-400" />
                        <span class="font-extrabold text-xl leading-tight mt-0.5">
                            {branch.totalCustomersServed}
                        </span>
                        <div class="text-sm text-white leading-none">
                            Atend.
                        </div>
                    </div>

                    <div class="flex flex-col items-center py-1 px-0.5">
                        <Clock class="size-6 text-purple-400" />
                        <span class="font-extrabold text-xl leading-tight mt-0.5">
                            {branch.totalNumberOfServedServices}
                        </span>
                        <div class="text-sm text-white leading-none">
                            Atenc.
                        </div>
                    </div>

                    <div class="flex flex-col items-center py-1 px-0.5">
                        <TrendingUp class="size-6 text-sky-400" />
                        <span class="font-extrabold text-xl leading-tight mt-0.5">
                            {branch.totalNumberOfTransactions}
                        </span>
                        <div class="text-sm text-white leading-none">
                            Transac.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="text-slate-500 text-sm p-3 text-center bg-slate-900/50">
            No hay oficinas activas con métricas en este país.
        </div>
    {/each}
</CardContent>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>


<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1e293b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
    }
</style>