declare global {
  interface ICustomResponse {
    status: TStatus;
    message: string;
    data: object | null;
  }
  type TAuthForm = 'sign-in' | 'sign-up';
  type TStatus = 'success' | 'error';
  interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
  type Handler = (
    req: NextRequest,
    context: RouteHandlerContext,
  ) => Promise<Response>;
}
