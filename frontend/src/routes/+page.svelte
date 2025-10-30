<script>
    import { onMount } from "svelte";
    // Mantenemos solo las importaciones de componentes e íconos necesarios para el HTML
    import {
        Users,
        Clock,
        TrendingUp,
        DoorOpen,
        Building,
    } from "@lucide/svelte";
    import HeaderStats from "$lib/components/HeaderStats.svelte";
    import ContentStats from "$lib/components/ContentStats.svelte";
    // Si Card, Badge, y Button se usan solo dentro de HeaderStats/ContentStats, puedes quitarlas
    import {
        Card,
        CardHeader,
        CardContent,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button/index.js";
    
    // Importamos la lógica de datos y API
    import { fetchAllServers } from "$lib/data/api.js";
    import {
        collectAndEnrichBranches,
        aggregateBranchMetrics,
        calculateCountrySummaries,
    } from "$lib/data/metrics.js";

    // --- ESTADO (Mantenemos aquí lo que es reactivo al componente) ---
    let isLoading = false;
    let lastUpdateText = "-";
    let statusMessage = "Listo para cargar datos.";
    let statusVariant = "info";
    
    let totalAtenciones = 0;
    let totalTransacciones = 0;
    let totalPuestosAbiertos = 0;
    let totalEnAtencion = 0;
    let totalOficinasActivas = 0;
    let totalOficinasInactivas = 0;
    let totalSedesDistribuidas = 0;
    let totalSedesCentral = 0;
    let totalSedes = 0;
    let countrySummaries = []; // Array de resumen por país

    // --- LÓGICA DE CARGA CENTRAL ---
    const loadData = async () => {
        // Reiniciar contadores (Se mantiene aquí por ser parte del estado local)
        totalAtenciones = 0;
        totalTransacciones = 0;
        totalPuestosAbiertos = 0;
        totalEnAtencion = 0;
        totalOficinasActivas = 0;
        totalOficinasInactivas = 0;
        totalSedesDistribuidas = 0;
        totalSedesCentral = 0;
        totalSedes = 0;
        countrySummaries = [];
        
        isLoading = true;
        statusMessage = "Obteniendo servidores...";
        statusVariant = "info";

        try {
            // 1. OBTENER DATOS INICIALES (Llamada a API.js)
            const initialResults = await fetchAllServers();
            
            // Contar el total de sedes habilitadas (Lógica de conteo simple, se mantiene aquí)
            totalSedes = initialResults.reduce((count, r) => {
                if (r.success && Array.isArray(r.data)) {
                    return count + r.data.filter((b) => b.enabled).length;
                }
                return count;
            }, 0);

            // 2. ENRIQUECER Y CONSOLIDAR (Llamada a metrics.js)
            statusMessage = "Recopilando...";
            const detailedInfoByCountry = await collectAndEnrichBranches(initialResults);

            statusMessage = "Agregando métricas...";
            const finalResumenPorPais = aggregateBranchMetrics(detailedInfoByCountry);

            // 3. CALCULAR RESUMENES (Llamada a metrics.js)
            countrySummaries = calculateCountrySummaries(finalResumenPorPais);

            // 4. CALCULAR MÉTRICAS GLOBALES (Lógica simple de reducción, se mantiene aquí)
            let allBranches = [];
            countrySummaries.forEach((summary) => {
                allBranches = allBranches.concat(summary.branches);
            });

            allBranches.forEach((branch) => {
                totalAtenciones += branch.totalCustomersServed;
                totalTransacciones += branch.totalNumberOfTransactions;
                totalPuestosAbiertos += branch.totalOpenServicePoints;
                totalEnAtencion += branch.totalNumberOfServedServices;
                
                if (branch.central === "Central") {
                    totalSedesCentral++;
                } else {
                    totalSedesDistribuidas++;
                }
                
                // Contar oficinas activas (con actividad o puestos abiertos)
                if (
                    branch.totalOpenServicePoints > 0 ||
                    branch.totalCustomersServed > 0 ||
                    branch.totalNumberOfTransactions > 0
                ) {
                    totalOficinasActivas++;
                }
            });

            totalOficinasInactivas = totalSedes - totalOficinasActivas;

            // Actualizar UI de estado
            lastUpdateText = new Date().toLocaleTimeString("es-ES");
            statusMessage = `Datos de ${countrySummaries.length} países cargados.`;
            statusVariant = "success";
            
        } catch (error) {
            console.error(error);
            statusMessage = `Error: ${error.message}`;
            statusVariant = "danger";
        } finally {
            isLoading = false;
        }
    };

    // --- Ciclos de vida y Eventos (Svelte Way) ---
    onMount(() => {
        loadData();
        const interval = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    });
</script>

<div>
    <HeaderStats
        {totalAtenciones}
        {totalEnAtencion}
        {totalTransacciones}
        {totalPuestosAbiertos}
        {totalOficinasActivas}
        {totalSedes}
        {isLoading}
        {statusMessage}
        {statusVariant}
        {lastUpdateText}
        {loadData}
    />

    <ContentStats
        {isLoading}
        {countrySummaries}
        {totalSedes}
        {totalOficinasActivas}
        {totalOficinasInactivas}
        {totalSedesDistribuidas}
        {totalSedesCentral}
    />
</div>