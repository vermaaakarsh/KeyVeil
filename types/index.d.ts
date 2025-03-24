interface Request extends NextRequest {
  userId: string;
}

type TForm = "sign-in" | "sign-up";
type TStatus = "success" | "error";
type Handler = (req: NextRequest, context?: any) => Promise<Response>;

interface ICustomResponse {
  status: TStatus;
  message: string;
  data: object;
}
