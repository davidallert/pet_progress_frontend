import styles from './Select.module.css'
import Species from '@/types/species'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: Species[]
}

export default function Select({options, ...props}: SelectProps) {

  return (
    <select className={styles.select} {...props}>
        <option className={styles.option} value="">Select a species</option>
        {options.map((species) => (
            <option className={styles.option} key={species.id} value={species.id} data-icon={species.icon}>{species.name}</option>
        ))}
    </select>
  )
}