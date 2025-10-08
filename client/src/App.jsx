// client/src/App.jsx
import { useEffect, useState } from "react";
import { LocationsAPI } from "./services/api";
import HotspotMap from "./components/HotspotMap";
import mapImg from "./assets/nyc-tennis-map.png";

export default function App() {
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		(async () => setLocations(await LocationsAPI.all()))();
	}, []);

	// Keep your exact coordinates
	const positionsById = {
		1: { top: 16, left: 69 }, // Astoria Park
		2: { top: 43, left: 110 }, // Kissena Park
		3: { top: 69, left: 86 }, // Juniper Valley Park
		4: { top: 90, left: 93 }, // Forest Park
	};

	const metaById = {
		1: { borough: "Queens", note: "Astoria Park" },
		2: { borough: "Queens", note: "Kissena Park" },
		3: { borough: "Queens", note: "Juniper Valley Park" },
		4: { borough: "Queens", note: "Forest Park" },
	};

	return (
		<div className="page">
			{/* Full-screen background map with hotspots */}
			<HotspotMap
				imgSrc={mapImg}
				locations={locations}
				positionsById={positionsById}
				metaById={metaById}
			/>
			{/* Overlay nav removed */}
		</div>
	);
}
