interface EmailIconProps {
  size: number;
}
const EmailIcon: React.FC<EmailIconProps> = ({ size }: EmailIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.3332 9.3335L17.3452 16.9695C16.9384 17.2058 16.4763 17.3302 16.0058 17.3302C15.5354 17.3302 15.0733 17.2058 14.6665 16.9695L2.6665 9.3335M5.33317 5.3335H26.6665C28.1393 5.3335 29.3332 6.5274 29.3332 8.00016V24.0002C29.3332 25.4729 28.1393 26.6668 26.6665 26.6668H5.33317C3.86041 26.6668 2.6665 25.4729 2.6665 24.0002V8.00016C2.6665 6.5274 3.86041 5.3335 5.33317 5.3335Z"
        stroke="currentColor"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default EmailIcon;
