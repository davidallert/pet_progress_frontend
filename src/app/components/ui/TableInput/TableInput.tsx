import styles from './TableInput.module.css'

export default function TableInput(props: React.InputHTMLAttributes<HTMLInputElement>) {

  if (props.type === "textarea") {
    return <textarea rows="1" className={styles.input} {...(props as any)} />;
  }

  return (
      <input
        className={(props.type !== 'submit' ? `${styles.input}` : `${styles.input} ${styles.submit}`)}
        {...props}
      />
  )
}