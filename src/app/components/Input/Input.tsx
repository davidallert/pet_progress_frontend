import styles from '../../styles/form/form.module.css'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {

  return (
    <input
      className={(props.type !== 'submit' ? `${styles.formInput}` : `${styles.formInput} ${styles.formSubmit}`)}
      {...props}
    />
  )
}