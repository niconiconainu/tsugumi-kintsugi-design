import { AnalysisUseCase } from "@/application/usecase/analysis/analysis.usecase";
import { DesignUseCase } from "@/application/usecase/design/design.usecase";
import { EstimateUseCase } from "@/application/usecase/estimate/estimate.usecase";
import { ProjectUseCase } from "@/application/usecase/project/project.usecase";
import { RestorationUseCase } from "@/application/usecase/restoration/restoration.usecase";
import { WorkshopUseCase } from "@/application/usecase/workshop/workshop.usecase";
import { ImageAnalysisService } from "@/domain/service/analysis/image-analysis.service";
import { DesignService } from "@/domain/service/design/design.service";
import { EstimateService } from "@/domain/service/estimate/estimate.service";
import { LogisticsService } from "@/domain/service/logistics/logistics.service";
import { ProjectService } from "@/domain/service/project/project.service";
import { RestorationService } from "@/domain/service/restoration/restoration.service";
import { WorkshopMatcherService } from "@/domain/service/workshop/workshop-matcher.service";
import { GmiCopyGateway } from "@/infrastructure/ai/gmi-copy.gateway";
import { GmiDesignGateway } from "@/infrastructure/ai/gmi-design.gateway";
import { QwenImageAnalysisGateway } from "@/infrastructure/ai/qwen-image-analysis.gateway";
import { QwenImageRestoreGateway } from "@/infrastructure/ai/qwen-image-restore.gateway";
import { ProjectRepository } from "@/infrastructure/repository/project/project.repository";
import { WorkshopRepository } from "@/infrastructure/repository/workshop/workshop.repository";
import { AnalysisController } from "@/presentation/controller/v1/analysis/analysis.controller";
import { DesignController } from "@/presentation/controller/v1/design/design.controller";
import { EstimateController } from "@/presentation/controller/v1/estimate/estimate.controller";
import { ProjectController } from "@/presentation/controller/v1/project/project.controller";
import { RestorationController } from "@/presentation/controller/v1/restoration/restoration.controller";
import { WorkshopController } from "@/presentation/controller/v1/workshop/workshop.controller";

/**
 * DI 合成点（composition root）。
 * Next.js には DI コンテナが無いので、ここで一度だけ配線して Route Handler から使う。
 * 全層を import してよいのはこのファイルだけ（NestJS の `*.module.ts` に相当）。
 */

// infrastructure
const workshopRepository = new WorkshopRepository();
const projectRepository = new ProjectRepository();
const qwenImageAnalysisGateway = new QwenImageAnalysisGateway();
const qwenImageRestoreGateway = new QwenImageRestoreGateway();
const gmiDesignGateway = new GmiDesignGateway();
const gmiCopyGateway = new GmiCopyGateway();

// domain
const logisticsService = new LogisticsService();
const imageAnalysisService = new ImageAnalysisService(qwenImageAnalysisGateway);
const designService = new DesignService(gmiDesignGateway);
const restorationService = new RestorationService(qwenImageRestoreGateway);
const workshopMatcherService = new WorkshopMatcherService(
  workshopRepository,
  gmiCopyGateway,
  logisticsService
);
const estimateService = new EstimateService(workshopRepository, logisticsService);
const projectService = new ProjectService(projectRepository, gmiCopyGateway);

// application
const analysisUseCase = new AnalysisUseCase(imageAnalysisService);
const designUseCase = new DesignUseCase(designService);
const restorationUseCase = new RestorationUseCase(restorationService);
const workshopUseCase = new WorkshopUseCase(workshopMatcherService);
const estimateUseCase = new EstimateUseCase(estimateService);
const projectUseCase = new ProjectUseCase(projectService, workshopMatcherService);

// presentation
export const analysisController = new AnalysisController(analysisUseCase);
export const designController = new DesignController(designUseCase);
export const restorationController = new RestorationController(restorationUseCase);
export const workshopController = new WorkshopController(workshopUseCase);
export const estimateController = new EstimateController(estimateUseCase);
export const projectController = new ProjectController(projectUseCase);
