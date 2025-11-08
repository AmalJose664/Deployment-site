export default function parseUA(ua: string) {
	return {
		browser: ua.includes('Chrome') ? 'Chrome' :
			ua.includes('Firefox') ? 'Firefox' :
				ua.includes('Safari') ? 'Safari' : 'Other',
		os: ua.includes('Windows') ? 'Windows' :
			ua.includes('Mac') ? 'Mac' :
				ua.includes('Linux') ? 'Linux' : 'Other',
		isMobile: /Mobile|Android|iPhone/i.test(ua)
	};
}