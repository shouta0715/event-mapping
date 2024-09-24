import { NextRequest, NextResponse } from "next/server";
import { env, IS_DEVELOPMENT } from "@/env";

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
const withAuth = (req: NextRequest) => {
  if (IS_DEVELOPMENT) {
    return NextResponse.next();
  }

  const authorization = req.headers.get("authorization");

  if (authorization) {
    const authValue = authorization.split(" ")[1];

    const [username, password] = atob(authValue).split(":");

    if (
      username === env.BASIC_AUTH_USERNAME &&
      password === env.BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return NextResponse.json(
    { message: "Unauthorized" },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=Authorization Required",
      },
    }
  );
};

export default withAuth;
