// client/src/pages/Events.jsx
import { useEffect, useMemo, useState } from "react";
import { EventsAPI, LocationsAPI } from "../services/api";
import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";

export default function Events() {
	const [allEvents, setAllEvents] = useState([]); // raw list from API
	const [locations, setLocations] = useState([]);
	const [locationId, setLocationId] = useState(""); // "" = all
	const [sort, setSort] = useState("soonest"); // soonest | latest
	const [loading, setLoading] = useState(false);

	// load locations once
	useEffect(() => {
		(async () => setLocations(await LocationsAPI.all()))();
	}, []);

	// load events whenever sort changes
	useEffect(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			// Ask the server only for sorting; we’ll filter on the client
			const events = await EventsAPI.all({ sort });
			if (alive) {
				setAllEvents(events);
				setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [sort]);

	// derive filtered/sorted list instantly when locationId changes
	const visibleEvents = useMemo(() => {
		const list = locationId
			? allEvents.filter((e) => String(e.location_id) === String(locationId))
			: allEvents.slice();

		// extra safety: keep sort consistent even if server ignores it
		list.sort((a, b) =>
			sort === "latest"
				? new Date(b.start_time) - new Date(a.start_time)
				: new Date(a.start_time) - new Date(b.start_time)
		);
		return list;
	}, [allEvents, locationId, sort]);

	const locationMap = useMemo(
		() => Object.fromEntries(locations.map((l) => [String(l.id), l.name])),
		[locations]
	);

	return (
		<main className="container" style={{ padding: 20 }}>
			<p>
				<Link to="/">← Back to map</Link>
			</p>
			<h2>All Events</h2>

			<div
				style={{
					display: "flex",
					gap: 12,
					alignItems: "center",
					marginBottom: 12,
				}}
			>
				<label>
					Filter by location:&nbsp;
					<select
						value={locationId}
						onChange={(e) => setLocationId(e.target.value)}
						style={{ minWidth: 240 }}
					>
						<option value="">All locations</option>
						{locations.map((l) => (
							<option key={l.id} value={l.id}>
								{l.name}
							</option>
						))}
					</select>
				</label>

				<label>
					Sort:&nbsp;
					<select value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="soonest">Soonest first</option>
						<option value="latest">Latest first</option>
					</select>
				</label>
			</div>

			{loading && <p>Loading events…</p>}

			<div className="stack">
				{visibleEvents.map((e) => {
					const past = new Date(e.start_time) < new Date();
					return (
						<article
							key={e.id}
							className="card"
							style={{
								opacity: past ? 0.7 : 1,
								border: past ? "2px dashed #888" : "1px solid #ddd",
							}}
						>
							<div className="card-body">
								<h3 style={{ marginBottom: 6 }}>
									{e.title} • {e.sport}
								</h3>
								<p style={{ margin: 0 }}>
									{e.location_name || locationMap[String(e.location_id)]} •{" "}
									{new Date(e.start_time).toLocaleString()}
								</p>
								<p style={{ margin: 0 }}>
									Duration: {e.duration_mins} mins • Host: {e.host}
								</p>
								{e.notes && <p style={{ margin: 0 }}>{e.notes}</p>}
								<p style={{ marginTop: 6 }}>
									<Countdown startISO={e.start_time} />
								</p>
							</div>
						</article>
					);
				})}
				{!loading && visibleEvents.length === 0 && (
					<p>No events match this filter.</p>
				)}
			</div>
		</main>
	);
}
