import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProjectDetailPage,
  getProjectBySlug,
  getProjectSlugs,
} from "@/features/projects";

type PageProps = { params: Promise<{ slug: string }> };

// Pre-render a static page per project.
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
