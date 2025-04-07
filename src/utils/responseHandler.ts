export interface IResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
  }
  
  class ResponseHandler {
    public static success(res: any, message: string, data?: any): void {
      const response: IResponse = {
        success: true,
        message,
        data,
      };
      res.status(200).json(response);
    }
  
    public static created(res: any, message: string, data?: any): void {
      const response: IResponse = {
        success: true,
        message,
        data,
      };
      res.status(201).json(response);
    }
  
    public static error(
      res: any,
      message: string,
      error?: any,
      statusCode: number = 500
    ): void {
      const response: IResponse = {
        success: false,
        message,
        error: error?.message ? error?.message : error,
      };
      res.status(statusCode).json(response);
    }
  }
  
  export default ResponseHandler;
  