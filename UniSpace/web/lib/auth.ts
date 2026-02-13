import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: number;
  role: string;
};

export function verifyToken(request: Request): JwtPayload {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  return decoded;
}

export function verifyAdmin(request: Request): JwtPayload {
  const decoded = verifyToken(request);

  if (decoded.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return decoded;
}