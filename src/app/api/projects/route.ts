import { projectController } from "@/container";
import { routeHandler } from "@/presentation/handler/route-handler";

export const runtime = "nodejs";

export const POST = routeHandler(
  (request) => projectController.save(request),
  201
);
