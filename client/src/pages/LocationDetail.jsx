// client/src/pages/LocationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LocationsAPI } from "../services/api";
import Countdown from "../components/Countdown";

export default function LocationDetail() {
	const { id } = useParams();
	const [loc, setLoc] = useState(null);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		(async () => {
			const [l, ev] = await Promise.all([
				LocationsAPI.byId(id),
				LocationsAPI.events(id),
			]);
			setLoc(l);
			setEvents(ev);
		})();
	}, [id]);

	if (!loc) return <main style={{ padding: 20 }}>Loading…</main>;

	return (
		<main className="container" style={{ padding: 20 }}>
			<p>
				<Link to="/">← Back to map</Link>
			</p>

			<section className="loc-hero">
				<img src={loc.image} alt={loc.name} />
				<div>
					<h2>{loc.name}</h2>
					<p>
						{loc.city}, {loc.state} • {(loc.sport_types || []).join(" • ")}
					</p>
				</div>
			</section>

			<h3 style={{ marginTop: "1rem" }}>Events</h3>
			<div className="stack">
				{events.length === 0 && (
					<p style={{ color: "#eee" }}>
						No events scheduled at this location yet.
					</p>
				)}

				{events.map((e) => {
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
									{new Date(e.start_time).toLocaleString()} • {e.duration_mins}{" "}
									mins
								</p>
								<p style={{ margin: 0 }}>Host: {e.host}</p>
								{e.notes && <p style={{ margin: 0 }}>{e.notes}</p>}
								<p style={{ marginTop: 6 }}>
									<Countdown startISO={e.start_time} />
								</p>
							</div>
						</article>
					);
				})}
			</div>
		</main>
	);
}
