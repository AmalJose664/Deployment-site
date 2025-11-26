
import TestSSe from "@/components/TestSSe";

export default function Home() {
	return (
		<div>
			welcome to /
			<br />
			<br />
			<br />
			<div className="border rounded-2xl">
				<div
					style={{ height: 300, overflowY: "scroll" }}
				>
					{/* Long content */}
					<div style={{ height: 2000, padding: 20 }}>
						Scroll me
					</div>
				</div>
			</div>
		</div>
	);
}
