import styles from './Button.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: boolean;
}

export default function Button({loading=false, icon=false, children, ...props}: ButtonProps) {

  const className = [
    icon ? styles.icon : styles.button,
    props.type === 'submit' ? styles.submit : ''
  ].join(' ').trim();

  return (
    <button
      className={className}
      disabled={loading}
      {...props}
      >
      {loading ? <FontAwesomeIcon icon={faOtter} spinPulse/> : children}
    </button>
  )
}