const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const LocationsAPI = {
	all: () => fetch(`${BASE}/locations`).then((r) => r.json()),
	byId: (id) => fetch(`${BASE}/locations/${id}`).then((r) => r.json()),
	events: (id) => fetch(`${BASE}/locations/${id}/events`).then((r) => r.json()),
};

export default LocationsAPI;
