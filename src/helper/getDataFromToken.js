import jwt from "jsonwebtoken";

export async function getDataFromToken(request) {
  const token = request.cookies.get("token")?.value || "";

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken.id;
}
