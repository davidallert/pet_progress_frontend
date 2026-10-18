import styles from './TableSelect.module.css'
import SelectProps from '@/types/select-props'

export default function TableSelect({firstOptionText, options, ...props}: SelectProps) {

  return (
    <select className={styles.tableSelect} {...props}>
        {firstOptionText && !props.defaultValue ? <option className={styles.option} value="">{firstOptionText}</option> : ''}
        {options.map((option) => (
            <option className={styles.option} key={option.id} value={option.id} data-icon={option.icon}>{option.name}</option>
        ))}
    </select>
  )
}