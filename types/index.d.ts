import { NextRequest as OriginalNextRequest } from "next/server";
declare global {
  declare interface NextRequest extends OriginalNextRequest {
    userId: string;
  }
  interface ICustomResponse {
    status: TStatus;
    message: string;
    data: any;
  }
  type TForm = "sign-in" | "sign-up";
  type TStatus = "success" | "error";
  type Handler = (req: NextRequest, context?: any) => Promise<Response>;
}
