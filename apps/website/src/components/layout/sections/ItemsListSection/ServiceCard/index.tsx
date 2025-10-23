import { PageEntry } from "apps/website/src/lib/contentful-graphql";

const ServiceCard: React.FC<PageEntry> = ({ ...props }) => {
  return <div>{props.title}</div>;
};

export default ServiceCard;
