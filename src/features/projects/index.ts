// Public API of the Projects feature — import from "@/features/projects".
export { ProjectsPage } from "./projects-page";
export { ProjectDetailPage } from "./project-detail-page";
export {
  getProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "./lib/queries";
export type { Project } from "./data/projects";
