'use client'

import { useEffect, useState } from "react"

const TestSSe = () => {
	const [start, setStart] = useState(false)
	const [jsons, setJsons] = useState([{}])
	useEffect(() => {
		if (start) {
			const eventSource = new EventSource(
				`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/deployments/68fb57f12579553bef8ea548/logs/stream`,
				{ withCredentials: true }
			);

			eventSource.onmessage = (event) => {
				console.log(event)
				const log = JSON.parse(event.data);
				console.log('Log:', log);
				setJsons(prev => [log, ...prev])
			};

			eventSource.onerror = (error) => {
				console.log(eventSource.readyState)
				if (eventSource.readyState === EventSource.CLOSED) {
					console.log('SSE connection closed by server');
					eventSource.close();
					return;
				}

				if (eventSource.readyState === EventSource.CONNECTING) {
					console.log('SSE reconnecting...');
					return;
				}

				console.error('SSE connection failed');
				eventSource.close();
			};
			eventSource.addEventListener('done', () => {
				console.log('Stream complete');
				eventSource.close();
			});
			eventSource.addEventListener('close', () => {
				console.log('Stream completed -------');
				eventSource.close();
			});

			return () => {
				eventSource.close();
			};
		}
	}, [start]);
	return (
		<div className="flex flex-col">
			hey
			<button className="p-2 rounded-md border" onClick={() => setStart(!start)}>{start ? "Stop" : "Start"}</button>

			{jsons.map((j, i) => {
				return <pre className="p-4 border mb-1 text-xs" key={i}>
					{JSON.stringify(j, null, 2)}
				</pre>

			})}
		</div>
	)
}
export default TestSSe