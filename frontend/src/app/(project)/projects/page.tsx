"use client"

import axiosInstance from "@/utils/axios"
import { useState } from "react"

const page = () => {
	const [state, setState] = useState("")
	const [state2, setState2] = useState("")
	const check = async () => {
		try {
			const result = await axiosInstance.get("/auth/")
			setState(result.data)
		} catch (error) {
			console.log("errr ")
		}
	}
	const check2 = async () => {
		try {
			const result = await axiosInstance.get("/auth/")
			setState2(result.data)
		} catch (error) {
			console.log("errr ")
		}
	}
	return (
		<div>
			check for tests <br />
			<button style={{ padding: "10px", border: "1px solid red" }} onClick={check}>check</button><br />
			<button style={{ padding: "10px", border: "1px solid red" }} onClick={check2}>check 2</button><br />
			{JSON.stringify(state, null, 2)} <br />
			{JSON.stringify(state2, null, 2)}
		</div>
	)
}
export default page