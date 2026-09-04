import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({
  size = 18,
  strokeWidth = 1.6,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20c0-8 6-14 16-16-1 9-7 15-16 16Z" />
      <path d="M4 20c4-4 8-8 16-16" />
    </Base>
  );
}

export function LemonIcon(props: IconProps) {
  // Stylised lemon: oval body with a small leaf + stem at the top.
  return (
    <Base {...props}>
      <ellipse cx="12" cy="14" rx="8" ry="6.5" transform="rotate(-22 12 14)" />
      {/* pointed tip on the left (lemon nipple) */}
      <path d="M4.6 11.3 3 9.6" />
      {/* stem */}
      <path d="M16.4 7.6 18 4.6" />
      {/* small leaf attached to stem */}
      <path d="M18 4.6c1.6-.4 3 .4 3.2 2-.4 1.4-1.8 2-3.2 1.6" />
    </Base>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m5.6 5.6 2.8 2.8" />
      <path d="m15.6 15.6 2.8 2.8" />
      <path d="m5.6 18.4 2.8-2.8" />
      <path d="m15.6 8.4 2.8-2.8" />
    </Base>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6Z" />
      <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8Z" />
      <path d="M5 4l.6 1.6L7 6l-1.4.4L5 8l-.6-1.6L3 6l1.4-.4Z" />
    </Base>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18" />
      <path d="M12 3a13 13 0 0 0 0 18" />
    </Base>
  );
}

export function SpeakerOnIcon(props: IconProps) {
  // Speaker with two sound-wave arcs. The arcs carry `data-wave` so
  // the playing state can pulse them via CSS.
  return (
    <Base {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path data-wave="1" d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path data-wave="2" d="M18.5 5.5a9 9 0 0 1 0 13" />
    </Base>
  );
}

export function SpeakerOffIcon(props: IconProps) {
  // Speaker with an X through where the sound waves would be.
  return (
    <Base {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L7 9.1a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />
    </Base>
  );
}

export function WhatsAppIcon(props: IconProps) {
  // Official WhatsApp brand favicon (icons8).
  const { size = 18, width, height, ...rest } = props;
  return (
    <img
      src="https://img.icons8.com/windows/32/whatsapp--v1.png"
      width={width ?? size}
      height={height ?? size}
      alt=""
      aria-hidden="true"
      {...(rest as Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">)}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        ...(rest.style ?? {}),
      }}
    />
  );
}

export function CarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 17h14" />
      <path d="M3 13h18" />
      <path d="M5 13l1.6-4.2A2 2 0 0 1 8.5 7.5h7a2 2 0 0 1 1.9 1.3L19 13" />
      <path d="M3 13v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1" />
      <path d="M17 16v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4" />
      <circle cx="7" cy="17" r="1.2" />
      <circle cx="17" cy="17" r="1.2" />
    </Base>
  );
}

export function CityIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V9l5-3v15" />
      <path d="M10 21V3h8a2 2 0 0 1 2 2v16" />
      <path d="M7 12h2" />
      <path d="M7 16h2" />
      <path d="M13 8h2" />
      <path d="M13 12h2" />
      <path d="M13 16h2" />
    </Base>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Base>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </Base>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m5 12 5 5 9-11" />
    </Base>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </Base>
  );
}

export function GoogleMapsIcon(props: IconProps) {
  // Official Google Maps logo glyph (filled, multi-colour via path).
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      {...props}
    >
      <path d="M 22.5 1 C 20.205167 1 18.188218 2.199104 17.03125 4 L 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 24.178 4.0312187 24.346719 4.0742188 24.511719 L 17.060547 11.525391 C 17.367993 12.158787 17.711699 12.761454 18.064453 13.349609 L 16.414062 15 L 25.925781 24.511719 C 25.968781 24.346719 26 24.178 26 24 L 26 14.929688 C 26.150262 14.677052 26.302642 14.42312 26.457031 14.169922 C 27.649031 12.214922 29 10 29 7.5 C 29 3.916 26.084 1 22.5 1 z M 22.5 3 C 24.985 3 27 5.015 27 7.5 C 27 8.7647357 26.495722 10.009796 25.849609 11.222656 C 25.576646 11.734614 25.286561 12.243492 24.984375 12.742188 C 24.961257 12.780333 24.939145 12.819363 24.916016 12.857422 C 24.893877 12.893856 24.87369 12.928489 24.851562 12.964844 C 24.590882 13.393047 24.335344 13.816123 24.09375 14.232422 C 23.876765 14.606669 23.666653 14.980298 23.490234 15.34375 C 23.374003 15.582967 23.271776 15.818618 23.181641 16.052734 C 23.157929 16.114385 23.138795 16.175045 23.117188 16.236328 C 23.052253 16.420336 22.998792 16.602619 22.955078 16.783203 C 22.938216 16.852949 22.921558 16.922969 22.908203 16.992188 C 22.862715 17.227531 22.830078 17.460441 22.830078 17.689453 C 22.830078 17.858453 22.668 17.984375 22.5 17.984375 C 22.332 17.984375 22.193359 17.835969 22.193359 17.667969 C 22.19329 17.461781 22.168866 17.250683 22.130859 17.039062 C 22.118148 16.968099 22.096625 16.895774 22.080078 16.824219 C 22.049675 16.693133 22.016874 16.562701 21.974609 16.429688 C 21.943274 16.330799 21.908348 16.230784 21.871094 16.130859 C 21.825088 16.007743 21.774779 15.884405 21.720703 15.759766 C 21.678434 15.662152 21.636509 15.563366 21.589844 15.464844 C 21.553909 15.389111 21.512887 15.312583 21.474609 15.236328 C 21.345622 14.978958 21.197053 14.714234 21.046875 14.451172 C 20.892536 14.181183 20.735915 13.908328 20.568359 13.632812 C 20.29458 13.182251 20.019032 12.723499 19.742188 12.259766 C 19.303046 11.524378 18.885931 10.777542 18.570312 10.015625 C 18.568957 10.012356 18.567759 10.009129 18.566406 10.005859 C 18.482236 9.8023533 18.406399 9.5975813 18.337891 9.3925781 C 18.337491 9.3913808 18.33829 9.3898692 18.337891 9.3886719 C 18.271812 9.1906392 18.212422 8.992261 18.164062 8.7929688 C 18.144311 8.7103752 18.131588 8.627719 18.115234 8.5449219 C 18.089106 8.4148671 18.061947 8.2848149 18.044922 8.1542969 C 18.017173 7.9370607 18 7.7184005 18 7.5 C 18 7.2215179 18.033594 6.9520026 18.082031 6.6875 C 18.09127 6.6380794 18.098504 6.5878776 18.109375 6.5390625 C 18.159022 6.3115827 18.229868 6.0921001 18.3125 5.8789062 C 18.348354 5.788272 18.386206 5.6989549 18.427734 5.6113281 C 18.498742 5.458596 18.580907 5.3127754 18.667969 5.1699219 C 18.757403 5.025741 18.854338 4.8868318 18.958984 4.7539062 C 18.993687 4.7092353 19.03008 4.6663527 19.066406 4.6230469 C 19.253102 4.4030754 19.459169 4.1994142 19.683594 4.0175781 C 19.690412 4.0120539 19.696275 4.0054865 19.703125 4 C 20.473102 3.3837673 21.437248 3 22.5 3 z M 10.082031 6 C 11.140031 6 12.103078 6.4034531 12.830078 7.0644531 L 11.681641 8.2128906 C 11.250641 7.8438906 10.692031 7.6191406 10.082031 7.6191406 C 8.7220313 7.6191406 7.6210938 8.7200781 7.6210938 10.080078 C 7.6210938 11.439078 8.7220313 12.542969 10.082031 12.542969 C 11.223031 12.542969 12.014688 11.866875 12.304688 10.921875 L 10.082031 10.921875 L 10.082031 9.3613281 L 13.929688 9.3671875 C 14.263687 10.958187 13.506031 14.160156 10.082031 14.160156 C 7.8270312 14.160156 6 12.334078 6 10.080078 C 6 7.8260781 7.8270312 6 10.082031 6 z M 22.5 6 A 1.5 1.5 0 0 0 21 7.5 A 1.5 1.5 0 0 0 22.5 9 A 1.5 1.5 0 0 0 24 7.5 A 1.5 1.5 0 0 0 22.5 6 z M 15 16.414062 L 5.4882812 25.925781 C 5.6532813 25.968781 5.822 26 6 26 L 24 26 C 24.178 26 24.346719 25.968781 24.511719 25.925781 L 15 16.414062 z" />
    </svg>
  );
}

export function WazeIcon(props: IconProps) {
  // Official Waze logo glyph (filled).
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      {...props}
    >
      <path d="M 14 2 C 6.6 2 4 7.2 4 12 C 4 13.8 2.5992188 14 2.1992188 14 L 0.30078125 14 L 1.4003906 15.599609 C 1.4913234 15.690542 3.016704 17.757252 7.046875 19.035156 A 2.5 2.5 0 0 0 7 19.5 A 2.5 2.5 0 0 0 9.5 22 A 2.5 2.5 0 0 0 11.962891 19.910156 C 12.610064 19.960443 13.281033 20 14 20 C 14.057515 20 14.466307 19.987705 15.033203 19.892578 A 2.5 2.5 0 0 0 17.5 22 A 2.5 2.5 0 0 0 20 19.5 A 2.5 2.5 0 0 0 19.574219 18.107422 C 21.353914 16.878015 23 14.737493 23 11 C 23 4.1 17.1 2.1 14 2 z M 14 4 C 14.3 4 21 4.3 21 11 C 21 13.821473 19.854113 15.877239 17.490234 17 A 2.5 2.5 0 0 0 15.869141 17.609375 C 14.784302 17.997392 13.900391 18 13.900391 18 C 13.056648 18 12.212883 17.926064 11.369141 17.84375 A 2.5 2.5 0 0 0 9.5 17 A 2.5 2.5 0 0 0 8.2636719 17.330078 C 6.369821 16.75369 5.0197769 16.047039 4.1992188 15.5 C 5.1992187 14.9 6 13.8 6 12 C 6 9.6 6.8 4 14 4 z M 11 9 A 1 1 0 0 0 10 10 A 1 1 0 0 0 11 11 A 1 1 0 0 0 12 10 A 1 1 0 0 0 11 9 z M 16 9 A 1 1 0 0 0 15 10 A 1 1 0 0 0 16 11 A 1 1 0 0 0 17 10 A 1 1 0 0 0 16 9 z M 12 11.900391 L 10 12 C 10.1 13.2 11 15 13.5 15 C 16 15 17 13.199609 17 12.099609 L 15 12 C 15 12.1 14.9 13 13.5 13 C 12.2 13 12 12.200391 12 11.900391 z" />
    </svg>
  );
}

/* --- Navigation (floating dock) --------------------------- */
export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </Base>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7.5v.5" />
    </Base>
  );
}

export function ItineraryIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="M10 6h10" />
      <path d="M10 12h7" />
      <path d="M10 18h10" />
    </Base>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z" />
      <path d="M9 4v16" />
      <path d="M15 6v16" />
    </Base>
  );
}

export function RsvpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
      <path d="m8 14 2 2 4-4" />
    </Base>
  );
}

export function ContactIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L7 9.1a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />
    </Base>
  );
}

export function PawIcon(props: IconProps) {
  // Filled paw silhouette: 4 toe pads arranged in an arc + a large main pad.
  const { size = 18, width, height, ...rest } = props;
  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      {...rest}
    >
      <ellipse cx="5" cy="8" rx="1.8" ry="2.5" transform="rotate(-20 5 8)" />
      <ellipse cx="9.5" cy="5.5" rx="1.8" ry="2.5" />
      <ellipse cx="14.5" cy="5.5" rx="1.8" ry="2.5" />
      <ellipse cx="19" cy="8" rx="1.8" ry="2.5" transform="rotate(20 19 8)" />
      <path d="M12 10.5C8 10.5 4.5 13 4.5 17c0 2.5 2 4.5 4.5 4.5 1.1 0 1.8-.5 3-.5s1.9.5 3 .5c2.5 0 4.5-2 4.5-4.5 0-4-3.5-6.5-7.5-6.5z" />
    </svg>
  );
}
