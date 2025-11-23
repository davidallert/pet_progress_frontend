import styles from './Input.module.css'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {

  return (
    <input
      className={(props.type !== 'submit' ? `${styles.input}` : `${styles.input} ${styles.submit}`)}
      {...props}
    />
  )
}