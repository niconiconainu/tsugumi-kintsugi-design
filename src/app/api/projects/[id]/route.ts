import { projectController } from "@/container";
import { routeHandler } from "@/presentation/handler/route-handler";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = routeHandler<
  Awaited<ReturnType<typeof projectController.get>>,
  RouteContext
>(async (_request, context) => {
  const { id } = await context.params;
  return projectController.get(id);
});
