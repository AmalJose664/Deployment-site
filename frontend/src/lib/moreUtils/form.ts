import axios from "axios"

export const repoCheck = async (fieldValue: string) => {
	console.log("searching repo.....")
	const values = fieldValue.replace(/\/$/, "").split("/")
	const repoName = values[values.length - 1]
	const user = values[values.length - 2]
	if (!user || !repoName) return false
	try {
		const res = await axios.get("https://api.github.com/repos/" + user + "/" + repoName.replace(".git", ""))
		const data = res.data
		console.log(data, '<<<<')
		return res.status === 200
	} catch (error) {
		return false
	}
}
export const getBranches = async (repo: string, setFn: (newState: string[]) => void) => {
	if (!repo) return
	console.log("searching....")
	const values = repo.replace(/\/$/, "").split("/")
	const repoName = values[values.length - 1].replace(".git", "")
	const user = values[values.length - 2]
	if (!user || !repoName) return
	try {
		const res = await axios.get(`https://api.github.com/repos/${user}/${repoName}/branches`)
		const { data } = res
		const newData = data.map((d: any) => d.name)
		setFn(newData)
	} catch (error) {
		console.log("Invalid git url")
	}
}