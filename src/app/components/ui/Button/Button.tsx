import styles from './Button.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOtter } from '@fortawesome/free-solid-svg-icons'
import TooltipContext from '@/app/context/tooltip/context'
import { useContext, useEffect } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  icon?: boolean
  tooltip?: string
  animation?: string
}

export default function Button({loading=false, icon=false, animation="", tooltip= "", children, ...props}: ButtonProps) {
  const { setTooltip } = useContext(TooltipContext);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tooltip) {
      setTooltip({text: tooltip, isVisible: true});
    }
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTooltip({text: '', isVisible: false});
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTooltip(prev => ({ ...prev, isVisible: false }));

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const className = [
    icon ? styles.icon : styles.button,
    animation ? styles[animation] : '',
    props.type === 'submit' ? styles.submit : ''
  ].join(' ').trim();

  return (
    <button
      {...props}
      onClick={handleClick}
      onMouseEnter={(e) => handleMouseEnter(e)}
      onMouseLeave={(e) => handleMouseLeave(e)}
      className={className}
      disabled={loading}
      >
      {loading ? <FontAwesomeIcon icon={faOtter} spinPulse/> : children}
    </button>
  )
}