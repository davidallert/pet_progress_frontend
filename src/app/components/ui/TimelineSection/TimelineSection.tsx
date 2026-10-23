import styles from './TimelineSection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'
import eventCategoryIcons from '@/libraries/event-category-icons'

interface TimelineSectionProps {
    iconKey: string,
    first?: boolean,
    last?: boolean
}

export default function TimelineSection(params: TimelineSectionProps) {
    const { iconKey, first, last } = params;

    return <>
        <div className={styles.timelineSection}>
        {!first && <div className={styles.timelineUpper} />}
        <div className={styles.eventIcon}>
            <FontAwesomeIcon icon={eventCategoryIcons[iconKey] ?? 'paw'}/>
        </div>
        {!last && <div className={styles.timelineLower} />}
        </div>
    </>
}