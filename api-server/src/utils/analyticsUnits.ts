type timesFieldTypes = '5m' | '15m' | '1h' | '1d'
type rangeFieldsTypes = '1h' | '24h' | '7d' | '30d'

/**
 * 				interval >>---->  |--------------------- | --------------------- | -------------------- | ---------------------|
 * 								   _______interval_______ _______interval_______ _______interval_______ _______interval________
 * 
 * 				range	 >>---->  |--------------------------------------------------------------------------------------------|
 */

const intervalMap: Record<timesFieldTypes, number> = {
	'5m': 5, '15m': 15, '1h': 1, '1d': 1
}

const rangeMap: Record<rangeFieldsTypes, number> = {
	'1h': 1, '24h': 24,
	'7d': 7, '30d': 30
}

export const getRange = (range: string = "1h"): number => {
	return rangeMap[range as rangeFieldsTypes] || 1
}



export const formatInterval = (interval: '5m' | '15m' | '1h' | '1d',): string => {
	return `${intervalMap[interval]} ${getUnit(interval)}`
}


export const getInterval = (interval: string): number => {
	return intervalMap[interval as timesFieldTypes] || 1
}


export const getUnit = (string: string = ""): string => {
	const normalized = string.toLowerCase().trim();

	if (normalized.endsWith('m')) return 'MINUTE';
	if (normalized.endsWith('h')) return 'HOUR';
	if (normalized.endsWith('d')) return 'DAY';
	if (normalized.endsWith('mo') || normalized.includes('month')) return 'MONTH';
	if (normalized.endsWith('w')) return 'WEEK';

	return 'DAY';
}

