const BASE_URL = "https://www.swapi.tech/api";

export const fetchData = async (endpoint) => {
  try {
    let results = [];
    let url = `${BASE_URL}/${endpoint}`;

    while (url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      console.log(`Data from ${endpoint}:`, data);

      if (Array.isArray(data.results)) {
        if (endpoint === "planets") {
          const detailedPlanets = await Promise.all(
            data.results.map(async (item) => {
              try {
                const detailResponse = await fetch(item.url);
                const detailData = await detailResponse.json();
                const props = detailData.result.properties;

                return {
                  uid: item.uid,
                  name: props.name || "Unknown",
                  climate: props.climate || "Unknown",
                  diameter: props.diameter || "Unknown",
                  population: props.population || "Unknown",
                  gravity: props.gravity || "Unknown",
                  orbital_period: props.orbital_period || "Unknown",
                  terrain: props.terrain || "Unknown",
                };
              } catch (e) {
                console.warn(`Failed to fetch details for ${item.name}`, e);
                return {
                  uid: item.uid,
                  name: item.name,
                  climate: "Unknown",
                  diameter: "Unknown",
                  population: "Unknown",
                  gravity: "Unknown",
                  orbital_period: "Unknown",
                  terrain: "Unknown",
                };
              }
            })
          );

          results = results.concat(detailedPlanets);
        } else {
          results = results.concat(data.results);
        }
      } else if (Array.isArray(data.result)) {
        results = results.concat(data.result);
      } else {
        console.warn(`Unexpected data structure for ${endpoint}:`, data);
      }

      url = data.next;
    }

    return results;
  } catch (err) {
    console.error("fetchData error:", err);
    throw err;
  }
};
