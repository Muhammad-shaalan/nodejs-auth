class AppError extends Error {
    constructor() {
        super();
    }
    create(message, statusCode, statusText, data) {
        this.message = message;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.data = data;
        return this;
    }
}

module.exports = new AppError();