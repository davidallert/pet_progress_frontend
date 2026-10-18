import styles from './Select.module.css'
import SelectProps from '@/types/select-props'

export default function Select({firstOptionText, options, ...props}: SelectProps) {

  return (
    <select className={styles.select} {...props}>
        {firstOptionText ? <option className={styles.option} value="">{firstOptionText}</option> : ''}
        {options.map((option) => (
            <option className={styles.option} key={option.id} value={option.id} data-icon={option.icon}>{option.name}</option>
        ))}
    </select>
  )
}