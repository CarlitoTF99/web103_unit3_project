import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - imgSrc: string (map image URL)
 * - locations: array from API (must include id, name, lat, lng)
 * - positionsById: { [id:number]: { top:number, left:number } }
 * - metaById: { [id:number]: { borough?: string, note?: string } } // optional info for labels
 */
export default function HotspotMap({
	imgSrc,
	locations,
	positionsById,
	metaById = {},
}) {
	const navigate = useNavigate();

	const spots = useMemo(() => {
		return locations
			.map((loc) => ({ ...loc, pos: positionsById[Number(loc.id)] }))
			.filter((loc) => !!loc.pos);
	}, [locations, positionsById]);

	return (
		<div className="hotspot-wrap" aria-label="Map of NYC parks">
			<img
				src={imgSrc}
				alt="NYC tennis/pickleball parks map"
				className="hotspot-bg"
			/>
			{spots.map((l) => {
				const meta = metaById[l.id] || {};
				return (
					<button
						key={l.id}
						className="hotspot"
						style={{ top: `${l.pos.top}%`, left: `${l.pos.left}%` }}
						onClick={() => navigate(`/locations/${l.id}`)}
						aria-label={`Open ${l.name}`}
						title={`${l.name}${meta.borough ? " — " + meta.borough : ""}`}
					>
						<span className="hotspot-dot" />
						<span className="hotspot-label">
							{l.name}
							{meta.borough ? ` • ${meta.borough}` : ""}
						</span>
					</button>
				);
			})}
		</div>
	);
}
