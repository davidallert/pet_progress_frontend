import styles from './Input.module.css'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {

  if (props.type === "textarea") {
    return <textarea rows="5" className={styles.input} {...(props as any)} />;
  }

  return (
      <input
        className={(props.type !== 'submit' ? `${styles.input}` : `${styles.input} ${styles.submit}`)}
        {...props}
      />
  )
}