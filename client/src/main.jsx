import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import App from "./App.jsx";
import Events from "./pages/Events.jsx";
import LocationDetail from "./pages/LocationDetail.jsx";

import "picocss/pico.min.css";
import "./index.css";

function Shell() {
	return (
		<>
			{/* Fixed top nav with big title */}
			<header className="site-nav">
				<div className="site-nav-inner">
					<h1 className="brand">Game-Pick</h1>
					<nav className="site-links">
						<Link to="/">Home</Link>
						<Link to="/events">Events</Link>
					</nav>
				</div>
			</header>

			{/* Push content below the fixed nav */}
			<main className="site-main">
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/events" element={<Events />} />
					<Route path="/locations/:id" element={<LocationDetail />} />
				</Routes>
			</main>
		</>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Shell />
		</BrowserRouter>
	</React.StrictMode>
);
