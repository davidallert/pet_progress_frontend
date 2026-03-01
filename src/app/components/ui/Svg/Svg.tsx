import styles from './Svg.module.css';

interface Svg  {
    type: string,
    index: number
}

export default  function Svg({type, index}: Svg) {

    const svg = [
      <svg className={`${styles[type]} ${styles.svg1}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#A7F0BA" d="M52.1,-40.9C63.8,-26.9,67,-5.4,62.4,14C57.8,33.4,45.3,50.8,27.7,60.5C10,70.2,-12.8,72.1,-31.2,63.7C-49.6,55.3,-63.5,36.5,-65.2,18C-66.9,-0.5,-56.5,-18.6,-43.6,-32.9C-30.7,-47.1,-15.3,-57.6,2.4,-59.5C20.2,-61.4,40.4,-54.9,52.1,-40.9Z" transform="translate(100 100)" />
      </svg>,
      <svg className={`${styles[type]} ${styles.svg2}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#bfa7f0" d="M51.8,-44.9C57.6,-34,46.2,-13,40.7,8.5C35.2,30,35.5,52.1,24,62.5C12.5,73,-10.7,71.7,-26.3,61.6C-41.9,51.4,-49.8,32.3,-56.2,10.9C-62.6,-10.4,-67.4,-34,-57.8,-45.8C-48.2,-57.5,-24.1,-57.5,-0.6,-57C23,-56.6,45.9,-55.8,51.8,-44.9Z" transform="translate(100 100)" />
      </svg>,
      <svg className={`${styles[type]} ${styles.svg3}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFD6E8" d="M54.8,-58.7C71,-51.6,84.3,-34.4,82.1,-18.6C79.9,-2.9,62.3,11.5,50.7,27.1C39.1,42.8,33.5,59.8,22.2,66.1C10.9,72.5,-6.2,68.1,-24.7,63.4C-43.3,58.6,-63.3,53.4,-69.2,41C-75,28.7,-66.6,9.2,-58.4,-5.7C-50.3,-20.6,-42.5,-30.9,-32.8,-39.2C-23.1,-47.4,-11.5,-53.5,3.9,-58.1C19.3,-62.7,38.5,-65.8,54.8,-58.7Z" transform="translate(100 100)" />
      </svg>
    ];

    if (index > svg.length - 1) index = 0;

  return (
    svg[index]
  )
}