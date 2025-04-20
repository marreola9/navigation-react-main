const BASE_URL = "https://www.swapi.tech/api";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    if (endpoint === "films" && Array.isArray(data.result)) {
      return data.result.map((item) => ({
        ...item.properties,
        uid: item.uid,
      }));
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    if (data.result?.properties) {
      return [
        {
          ...data.result.properties,
          uid: data.result.uid,
        },
      ];
    }

    throw new Error("Unexpected data format");
  } catch (err) {
    console.error("fetchData error:", err);
    throw err;
  }
};
