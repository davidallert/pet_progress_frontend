import Species from '@/types/species'
import EventCategory from '@/types/event-category'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    firstOptionText?: string,
    options: Species[] | EventCategory[]
}

export default SelectProps;