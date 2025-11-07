class AppError extends Error {
	public statusCode: number;
	constructor(message: string, code: number, err?: any) {
		super(message);
		this.statusCode = code;
		this.name = "AppError";

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
