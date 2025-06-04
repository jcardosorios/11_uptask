import { Request, Response } from 'express';

export const handleError = (res: Response, error: any, customMessage?: string) => {
  console.error(error)
  res.status(500).json({
    errors: [
      {
        type: "server",
        msg: customMessage || "An internal server error occurred. Please try again later.",
        details: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
    ],
  })
}
