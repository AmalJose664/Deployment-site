'use client'

import React, { useEffect, useState } from "react"

const TestSSe = () => {
	const [start, setStart] = useState(false)
	const [jsons, setJsons] = useState([React])

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