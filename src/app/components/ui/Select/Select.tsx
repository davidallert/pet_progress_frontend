import styles from './Select.module.css'
import Species from '@/types/species'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    firstOptionText?: string,
    options: Species[]
}

export default function Select({firstOptionText, options, ...props}: SelectProps) {

  return (
    <select className={styles.select} {...props}>
        {firstOptionText ? <option className={styles.option} value="">{firstOptionText}</option> : ''}
        {options.map((species) => (
            <option className={styles.option} key={species.id} value={species.id} data-icon={species.icon}>{species.name}</option>
        ))}
    </select>
  )
}