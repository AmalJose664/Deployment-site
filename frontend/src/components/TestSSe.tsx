'use client'

import React, { useEffect, useRef, useState } from "react"

const TestSSe = () => {
	const [set, unSet] = useState(false)
	return (
		<div>
			<br />
			<br />
			<button className="border px-3 py-2 bg-red-700 rounded-sm mb-4 " onClick={() => unSet(!set)}>{set ? "Unset" : "Set"}</button>
			{set && <Caller />}
		</div>
	)
}
export default TestSSe


const Caller = () => {


	const [start, setStart] = useState(false)
	const [jsons, setJsons] = useState([{}])

	const eventSourceRef = useRef<EventSource | null>(null)
	const deploymentId = "68ff74fc0c735bac01ff7347"
	useEffect(() => {
		if (!start) return
		console.log(eventSourceRef)
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
			console.log("closed manual")
			return
		}
		console.log("Starting SSE for deployment:", deploymentId)
		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/deployments/${deploymentId}/logs/stream`,
			{ withCredentials: true }
		)
		eventSourceRef.current = eventSource

		eventSource.onmessage = (event) => {
			try {
				const receivedData = JSON.parse(event.data)
				setJsons(prev => [(receivedData as unknown as any), ...prev])
			} catch (err) {

			}
		}
		eventSource.onerror = (error) => {
			console.log(eventSource.readyState)
			if (eventSource.readyState === EventSource.CLOSED) {
				console.log('SSE connection closed by server');
				eventSource.close();
				eventSourceRef.current = null
				return;
			}
			if (eventSource.readyState === EventSource.CONNECTING) {
				console.log('SSE reconnecting...');
				return;
			}
			eventSourceRef.current = null
			console.log('SSE connection failed');
			eventSource.close();
		};

		eventSource.addEventListener("done", () => {
			eventSource.close();
			console.log('SSE connection closed by server 22');
			eventSourceRef.current = null
		})
		eventSource.addEventListener("close", () => {
			eventSource.close();
			console.log('SSE connection closed by server');
			eventSourceRef.current = null
		})

		return () => { eventSource.close(); console.log("should remove"); eventSourceRef.current = null }
	}, [start])

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