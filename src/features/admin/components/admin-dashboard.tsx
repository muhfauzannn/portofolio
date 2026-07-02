"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut } from "@/lib/auth-client";
import { HeroEditor } from "@/features/admin/components/hero-editor";
import { AboutEditor } from "@/features/admin/components/about-editor";
import { ExperienceEditor } from "@/features/admin/components/experience-editor";
import { ProjectsEditor } from "@/features/admin/components/projects-editor";
import { SkillsEditor } from "@/features/admin/components/skills-editor";
import type {
  AboutRow,
  ExperienceRow,
  HeroPhotoRow,
  HeroSocialRow,
  ProjectRow,
  SiteSettingRow,
  SkillRow,
} from "@/features/admin/lib/data";

export function AdminDashboard({
  socials,
  photos,
  siteSetting,
  about,
  experience,
  projects,
  skills,
}: {
  socials: HeroSocialRow[];
  photos: HeroPhotoRow[];
  siteSetting: SiteSettingRow | null;
  about: AboutRow | null;
  experience: ExperienceRow[];
  projects: ProjectRow[];
  skills: SkillRow[];
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl">Content</h1>
          <p className="text-sm text-muted-foreground">
            Edit your portfolio. Changes go live immediately.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </header>

      <Tabs defaultValue="hero">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroEditor
            socials={socials}
            photos={photos}
            siteSetting={siteSetting}
          />
        </TabsContent>
        <TabsContent value="about">
          <AboutEditor about={about} />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceEditor items={experience} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsEditor projects={projects} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsEditor skills={skills} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
