export type IntervalsMapType = {
	"1h": { value: string, label: string }[],
	"24h": { value: string, label: string }[],
	"7d": { value: string, label: string }[],
	"30d": { value: string, label: string }[],
}
export const intervalsMap: IntervalsMapType = {
	"1h": [{ value: "1m", label: "minutes" },
	{ value: "24h", label: "hour", }],
	"24h": [
		{ value: "1m", label: "minutes" },
		{ value: "1h", label: "hour", },
	],
	"7d": [
		{ value: "1h", label: "hour" },
		{ value: "1d", label: "day", },
	],
	"30d": [
		{ value: "1d", label: "day", },
		{ value: "7d", label: "week", },
	],
}

const validIntervals = []
export const checkIntervalValid = () => {

}