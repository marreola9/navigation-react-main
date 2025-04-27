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
        results = results.concat(data.results);
      } else if (endpoint === "films" && Array.isArray(data.result)) {
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
