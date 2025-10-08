// client/src/components/Countdown.jsx
import { useEffect, useState } from "react";

export default function Countdown({ startISO }) {
	const [now, setNow] = useState(() => new Date());
	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(t);
	}, []);
	const start = new Date(startISO);
	const diffMs = start - now;

	const past = diffMs < 0;
	const abs = Math.abs(diffMs);
	const sec = Math.floor(abs / 1000) % 60;
	const min = Math.floor(abs / (1000 * 60)) % 60;
	const hours = Math.floor(abs / (1000 * 60 * 60)) % 24;
	const days = Math.floor(abs / (1000 * 60 * 60 * 24));

	return (
		<span style={{ fontWeight: 800, color: past ? "#aaa" : "#0f0" }}>
			{past ? "Started " : "Starts in "}
			{days ? `${days}d ` : ""}
			{hours ? `${hours}h ` : ""}
			{min ? `${min}m ` : ""}
			{sec ? `${sec}s` : "0s"}
			{past ? " ago" : ""}
		</span>
	);
}
