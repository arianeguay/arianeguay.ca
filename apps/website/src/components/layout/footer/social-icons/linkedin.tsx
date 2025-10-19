interface LinkedinIconProps {
  size: number;
}
const LinkedinIcon: React.FC<LinkedinIconProps> = ({
  size,
}: LinkedinIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9997 12.5005C21.591 12.5005 23.1171 13.1326 24.2423 14.2578C25.3675 15.3831 25.9997 16.9092 25.9997 18.5005V25.5005H21.9997V18.5005C21.9997 17.9701 21.789 17.4613 21.4139 17.0863C21.0388 16.7112 20.5301 16.5005 19.9997 16.5005C19.4692 16.5005 18.9605 16.7112 18.5855 17.0863C18.2104 17.4613 17.9997 17.9701 17.9997 18.5005V25.5005H13.9997V18.5005C13.9997 16.9092 14.6318 15.3831 15.757 14.2578C16.8823 13.1326 18.4084 12.5005 19.9997 12.5005Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99968 13.5005H5.99968V25.5005H9.99968V13.5005Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99968 10.5005C9.10425 10.5005 9.99968 9.60506 9.99968 8.50049C9.99968 7.39592 9.10425 6.50049 7.99968 6.50049C6.89511 6.50049 5.99968 7.39592 5.99968 8.50049C5.99968 9.60506 6.89511 10.5005 7.99968 10.5005Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default LinkedinIcon;
