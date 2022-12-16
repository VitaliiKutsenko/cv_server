module.exports = class ApiErrors extends Error{
    status;
    errors;

    constructor(status,message,errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiErrors(401, 'User is not authorized')
    }

    static BadRequestError(message,errors=[]){
        return new ApiErrors(400,message,errors)
    }
}