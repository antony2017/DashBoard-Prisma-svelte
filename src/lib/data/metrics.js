import { fetchManagementInfo, fetchBranchStatus } from "./api.js";

// Helper function that sums the values of a specific numeric field in an array of objects.
// If the field is not a number in an object, it adds 0 instead.
const sumField = (arr, field) =>
  arr.reduce(
    (acc, obj) => acc + (typeof obj[field] === "number" ? obj[field] : 0),
    0
  );

/**
 * Collects detailed data and determines the Central/Distributed status of each branch.
 * It processes initial results, fetches additional information per branch, and enriches the data.
 */
export const collectAndEnrichBranches = async (initialResults) => {
  const infoPorPais = {};

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
          // Fetch management info for the branch
          const infoJson = await fetchManagementInfo(serverUrl, branch.id);
          const info = infoJson?.data || [];

          totalOpenServicePoints = info.reduce(
            (acc, obj) => acc + (obj.status !== "CLOSED" ? 1 : 0),
            0
          );
          totalCustomersServed = sumField(info, "customersServed");
          totalNumberOfTransactions = sumField(info, "numberOfTransactions");
          totalNumberOfServedServices = info.reduce(
            (acc, obj) =>
              acc + (obj.currentTicketNumber?.trim() !== "" ? 1 : 0),
            0
          );

          // Fetch branch status to determine if it's Central or Distributed
          const statusJson = await fetchBranchStatus(serverUrl, branch.id);
          agentValue =
            statusJson?.data?.agentId?.toLowerCase() === "central"
              ? "Central"
              : "Distribuido";
        } catch (err) {
          console.error(
            `Error enriching branch ${branch.name} from ${serverName}:`,
            err
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

/**
 * Aggregates branch metrics by BranchId and Server.
 * It consolidates the data and filters out branches with no activity or disabled status.
 */
export const aggregateBranchMetrics = (infoPorPais) => {
  const resumenPorPais = {};

  Object.keys(infoPorPais).forEach((pais) => {
    const grouped = infoPorPais[pais].reduce((acc, item) => {
      const key = `${pais}-${item.branchId}-${item.serverName}`;

      if (!acc[key]) {
        // Initialize aggregation object
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

      // Aggregate metrics
      acc[key].totalCustomersServed += item.totalCustomersServed || 0;
      acc[key].totalNumberOfTransactions += item.totalNumberOfTransactions || 0;
      acc[key].totalOpenServicePoints += item.totalOpenServicePoints || 0;
      acc[key].totalNumberOfServedServices +=
        item.totalNumberOfServedServices || 0;

      return acc;
    }, {});

    const consolidatedArray = Object.values(grouped);

    // Filter out branches that are disabled or have no activity
    const filteredArray = consolidatedArray.filter(
      (branch) =>
        branch.oficinaEnabled === true &&
        (branch.totalCustomersServed > 0 ||
          branch.totalNumberOfTransactions > 0)
    );

    // Sort branches by number of customers served
    const filteredAndSortedArray = filteredArray.sort(
      (a, b) => b.totalCustomersServed - a.totalCustomersServed
    );

    resumenPorPais[pais] = filteredAndSortedArray;
  });

  return resumenPorPais;
};

/**
 * Calculates total metrics per country and sorts them by customer volume.
 * Returns a summary list with totals and branch details.
 */
export const calculateCountrySummaries = (resumenPorPais) => {
  const summaries = [];

  Object.entries(resumenPorPais).forEach(([country, branches]) => {
    const totalCustomersServed = branches.reduce(
      (sum, b) => sum + b.totalCustomersServed,
      0
    );
    const totalBranches = branches.length;

    summaries.push({
      country,
      totalCustomersServed,
      totalBranches,
      branches,
    });
  });

  // Sort countries by total customers served
  summaries.sort((a, b) => b.totalCustomersServed - a.totalCustomersServed);

  return summaries;
};
``;
