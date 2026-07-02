import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import {
  getAboutAdmin,
  getExperienceAdmin,
  getHeroPhotosAdmin,
  getHeroSocialsAdmin,
  getProjectsAdmin,
  getSkillsAdmin,
} from "@/features/admin/lib/data";

/**
 * Admin composition root. Server Component: reads the current content (uncached
 * so edits show immediately) and hands it to the client dashboard.
 */
export async function AdminPage() {
  const [socials, photos, about, experience, projects, skills] =
    await Promise.all([
      getHeroSocialsAdmin(),
      getHeroPhotosAdmin(),
      getAboutAdmin(),
      getExperienceAdmin(),
      getProjectsAdmin(),
      getSkillsAdmin(),
    ]);

  return (
    <AdminDashboard
      socials={socials}
      photos={photos}
      about={about}
      experience={experience}
      projects={projects}
      skills={skills}
    />
  );
}
