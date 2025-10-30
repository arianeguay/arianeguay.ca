"use client";
import { useLocale } from "apps/website/src/context/locale-provider";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import JobExperienceCard from "./ExperienceCard";
import { ExperienceTimelineItem } from "./types";
import { formatRange } from "./utils";

interface ExperienceSectionVerticalTimelineProps {
  items: ExperienceTimelineItem[];
}
const ExperienceSectionVerticalTimeline: React.FC<
  ExperienceSectionVerticalTimelineProps
> = ({ items }) => {
  const { locale } = useLocale();
  return (
    <VerticalTimeline>
      {items.map((event) => (
        <VerticalTimelineElement
          key={event.id}
          contentStyle={{
            border: "none",
            background: "transparent",
            padding: 0,
            boxShadow: "none",
          }}
          date={formatRange(event.startDate, event.endDate, locale)}
          iconStyle={{ background: event.color }}
          icon={
            event.type === "experience" ? (
              <BriefcaseBusiness color={"white"} />
            ) : (
              <GraduationCap color={"white"} />
            )
          }
        >
          <JobExperienceCard data={event} />
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default ExperienceSectionVerticalTimeline;
