import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProjectDetailPage,
  PROJECTS_CONTENT,
  getProject,
} from "@/features/projects";

type PageProps = { params: Promise<{ slug: string }> };

// Pre-render a static page per project.
export function generateStaticParams() {
  return PROJECTS_CONTENT.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Muhammad Fauzan`,
    description: project.tagline,
  };
}

// Route entry — thin layer that resolves the project and delegates to the
// feature, or 404s for an unknown slug.
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
