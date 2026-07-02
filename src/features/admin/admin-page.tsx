import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import {
  getAboutAdmin,
  getExperienceAdmin,
  getHeroPhotosAdmin,
  getHeroSocialsAdmin,
  getProjectsAdmin,
  getSiteSettingAdmin,
  getSkillsAdmin,
} from "@/features/admin/lib/data";

/**
 * Admin composition root. Server Component: reads the current content (uncached
 * so edits show immediately) and hands it to the client dashboard.
 */
export async function AdminPage() {
  const [socials, photos, siteSetting, about, experience, projects, skills] =
    await Promise.all([
      getHeroSocialsAdmin(),
      getHeroPhotosAdmin(),
      getSiteSettingAdmin(),
      getAboutAdmin(),
      getExperienceAdmin(),
      getProjectsAdmin(),
      getSkillsAdmin(),
    ]);

  return (
    <AdminDashboard
      socials={socials}
      photos={photos}
      siteSetting={siteSetting}
      about={about}
      experience={experience}
      projects={projects}
      skills={skills}
    />
  );
}
