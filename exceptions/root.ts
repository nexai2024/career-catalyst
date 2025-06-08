//messsage. status code, error code error

class HttpExceptiom extends Error {
    public statusCode: number;
    public errorCode: string;
    public message: string;
    public errors: any;
    
    constructor(statusCode: number, errorCode: string, message: string, errors?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.message = message;
        this.errors = errors || null;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
    
    toJSON() {
        return {
        statusCode: this.statusCode,
        errorCode: this.errorCode,
        message: this.message,
        };
    }
}