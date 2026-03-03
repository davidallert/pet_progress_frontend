import styles from './Button.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  icon?: boolean
  tooltip?: string
}

export default function Button({loading=false, icon=false, tooltip= "", children, ...props}: ButtonProps) {

  /**
   * Create a tooltip element on hover if the tooltip prop is populated.
   */
  const handleMouseEnter = (e: any) => {
    if (tooltip) {
      const tt = document.createElement("div");

      tt.className = styles.tt;
      tt.id = "tt";
      tt.innerText = tooltip;

      e.target.parentElement.append(tt);

      // const rotation = getRotation(tt);

      // tt.style.transform = `rotate(${rotation}deg)`;
    }
  }

  const handleMouseLeave = () => {
    const tt = document.getElementById("tt");
    tt?.remove();
  }

  /**
   * Recursively get the rotal rotation of any parent elements.
   * Inverse that rotation in order to align the tooltip correctly.
   * Issue: doesn't center the tooltip directly over the button. Deactivating for now.
   */
  // const getRotation = (element: HTMLElement  | null): number => {
  //   let totalRotation = 0;

  //   while (element) {
  //     const transform = window.getComputedStyle(element).transform;

  //     if (transform && transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
  //       const matrix = new DOMMatrix(transform);
  //       const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
  //       totalRotation += rotation;
  //     }

  //     element = element.parentElement;
  //   }

  //   const inverseRotation = totalRotation * -1;

  //   return inverseRotation;
  // }

  const className = [
    icon ? styles.icon : styles.button,
    props.type === 'submit' ? styles.submit : ''
  ].join(' ').trim();

  return (
    <button
      onMouseEnter={(e) => handleMouseEnter(e)}
      onMouseLeave={handleMouseLeave}
      className={className}
      disabled={loading}
      {...props}
      >
      {loading ? <FontAwesomeIcon icon={faOtter} spinPulse/> : children}
    </button>
  )
}