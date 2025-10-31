// src/lib/data/metrics.js
import { fetchManagementInfo, fetchBranchStatus } from "./api.js";

// Función auxiliar (se mantiene igual)
const sumField = (arr, field) =>
    arr.reduce(
        (acc, obj) => acc + (typeof obj[field] === "number" ? obj[field] : 0),
        0
    );


/**
 * Colecciona datos detallados y determina el estado Central/Distribuido de cada sucursal.
 */
export const collectAndEnrichBranches = async (initialResults) => {
    const infoPorPais = {};

    // Mantenemos la lógica de filtración y llamadas asíncronas aquí
    // ... (El cuerpo de collectAndEnrichBranches se mueve aquí)

    for (const result of initialResults) {
        const country = result.server?.Pais || "SIN_PAIS";
        const serverName = result.server?.Nombre || "N/A";
        const serverUrl = result.server?.URL;

        if (result.success && Array.isArray(result.data)) {
            if (!infoPorPais[country]) infoPorPais[country] = [];

            const enabledBranches = result.data.filter((branch) => branch.enabled);

            const branchPromises = enabledBranches.map(async (branch) => {
                let totalOpenServicePoints = 0,
                    totalCustomersServed = 0,
                    totalNumberOfServedServices = 0,
                    totalNumberOfTransactions = 0;
                let agentValue = "Distribuido";

                try {
                    // USO DE NUEVAS FUNCIONES DE API
                    const infoJson = await fetchManagementInfo(serverUrl, branch.id);
                    const info = infoJson?.data || [];
                    
                    totalOpenServicePoints = info.reduce(
                        (acc, obj) => acc + (obj.status !== "CLOSED" ? 1 : 0),
                        0,
                    );
                    totalCustomersServed = sumField(info, "customersServed");
                    totalNumberOfTransactions = sumField(info, "numberOfTransactions");
                    totalNumberOfServedServices = info.reduce(
                        (acc, obj) => acc + (obj.currentTicketNumber?.trim() !== "" ? 1 : 0),
                        0,
                    );

                    // USO DE NUEVAS FUNCIONES DE API
                    const statusJson = await fetchBranchStatus(serverUrl, branch.id);
                    agentValue =
                        statusJson?.data?.agentId?.toLowerCase() === "central"
                            ? "Central"
                            : "Distribuido";
                } catch (err) {
                    console.error(
                        `Error enriqueciendo branch ${branch.name} de ${serverName}:`,
                        err,
                    );
                }

                return {
                    country,
                    branchId: branch.id,
                    branchName: branch.name,
                    serverName,
                    totalCustomersServed,
                    totalNumberOfTransactions,
                    totalOpenServicePoints,
                    totalNumberOfServedServices,
                    central: agentValue,
                    oficinaEnabled: branch.enabled,
                };
            });

            const detailedBranches = await Promise.all(branchPromises);

            infoPorPais[country] = infoPorPais[country].concat(detailedBranches);
        }
    }
    return infoPorPais;
};


/** Consolida las métricas de las sucursales por BranchId-Servidor. */
export const aggregateBranchMetrics = (infoPorPais) => {
    const resumenPorPais = {};

    // ... (El cuerpo de aggregateBranchMetrics se mueve aquí)
    Object.keys(infoPorPais).forEach((pais) => {
        const grouped = infoPorPais[pais].reduce((acc, item) => {
            const key = `${pais}-${item.branchId}-${item.serverName}`;

            if (!acc[key]) {
                // Inicialización
                acc[key] = {
                    branchName: item.branchName,
                    branchId: item.branchId,
                    country: pais,
                    servidor: item.serverName,
                    central: item.central || "Distribuido",
                    oficinaEnabled: item.oficinaEnabled,
                    totalCustomersServed: 0,
                    totalNumberOfTransactions: 0,
                    totalOpenServicePoints: 0,
                    totalNumberOfServedServices: 0,
                };
            }

            // Consolidación (suma de métricas)
            acc[key].totalCustomersServed += item.totalCustomersServed || 0;
            acc[key].totalNumberOfTransactions += item.totalNumberOfTransactions || 0;
            acc[key].totalOpenServicePoints += item.totalOpenServicePoints || 0;
            acc[key].totalNumberOfServedServices += item.totalNumberOfServedServices || 0;

            return acc;
        }, {});

        const consolidatedArray = Object.values(grouped);

        const filteredArray = consolidatedArray.filter(
            (branch) =>
                branch.oficinaEnabled === true &&
                (branch.totalCustomersServed > 0 || branch.totalNumberOfTransactions > 0),
        );

        const filteredAndSortedArray = filteredArray.sort((a, b) => b.totalCustomersServed - a.totalCustomersServed);

        resumenPorPais[pais] = filteredAndSortedArray;
    });

    return resumenPorPais;
};

/** Suma y ordena los totales por país. */
export const calculateCountrySummaries = (resumenPorPais) => {
    const summaries = [];

    // ... (El cuerpo de calculateCountrySummaries se mueve aquí)
    Object.entries(resumenPorPais).forEach(([country, branches]) => {
        const totalCustomersServed = branches.reduce((sum, b) => sum + b.totalCustomersServed, 0);
        const totalBranches = branches.length;

        summaries.push({
            country,
            totalCustomersServed,
            totalBranches,
            branches,
        });
    });

    summaries.sort((a, b) => b.totalCustomersServed - a.totalCustomersServed);

    return summaries;
};