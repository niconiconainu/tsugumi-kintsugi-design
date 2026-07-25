import { analysisController } from "@/container";
import { routeHandler } from "@/presentation/handler/route-handler";

export const runtime = "nodejs";

export const POST = routeHandler((request) => analysisController.analyze(request));
