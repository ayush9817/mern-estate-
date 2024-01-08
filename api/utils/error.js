export const errorHandler = (satausCode,message)=>{
    const error = new Error();
    error.satausCode = satausCode;
    error.message = message;
    return error;
}