import { ExperienceSection, Tag } from "apps/website/src/types/shared";

export interface ExperienceSectionProps {
  data: ExperienceSection;
}

export interface ExperienceTimelineItem {
  id: string;
  date: string;
  startDate: string;
  endDate: string;
  title: string;
  subtitle: string;
  color: string;
  description?: React.ReactNode;
  highlights?: React.ReactNode;
  tags?: Tag[];
  type: "experience" | "formation";
}
