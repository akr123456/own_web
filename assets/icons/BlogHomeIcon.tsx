import { type IconProps } from '~/assets'

export function BlogHomeIcon(props: IconProps = {}) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M466.624 83.008a64 64 0 0 1 91.072 0l384.128 388.672a64 64 0 0 1-45.504 108.992h-8v316.608a64 64 0 0 1-64 64H200a64 64 0 0 1-64-64V580.672H128a64 64 0 0 1-45.504-108.992L466.56 83.008zM352.128 769.28a32 32 0 1 0 0 64h320a32 32 0 0 0 0-64h-320z"
        fill="currentColor"
      />
    </svg>
  )
}
