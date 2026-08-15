import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export default function Linkedin({ width = 24, height = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        d="M0 1.72C0 0.77 0.79 0 1.76 0H22.24C23.21 0 24 0.77 24 1.72V22.28C24 23.23 23.21 24 22.24 24H1.76C0.79 24 0 23.23 0 22.28V1.72ZM7.41 20.09V9.25H3.81V20.09H7.41ZM5.61 7.77C6.87 7.77 7.65 6.94 7.65 5.9C7.63 4.84 6.87 4.03 5.64 4.03C4.41 4.03 3.6 4.84 3.6 5.9C3.6 6.94 4.38 7.77 5.59 7.77H5.61V7.77ZM12.98 20.09V14.04C12.98 13.71 13 13.39 13.1 13.16C13.36 12.51 13.95 11.84 14.94 11.84C16.25 11.84 16.77 12.84 16.77 14.29V20.09H20.37V13.88C20.37 10.54 18.59 9 16.22 9C14.31 9 13.46 10.05 12.98 10.79V10.82H12.95C12.96 10.81 12.97 10.8 12.98 10.79V9.25H9.38C9.42 10.27 9.38 20.09 9.38 20.09H12.98Z"
      />
    </svg>
  );
}
