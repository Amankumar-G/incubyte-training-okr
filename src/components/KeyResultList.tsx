import type { KeyResult } from '../types/okr_types'

type KeyResultListProps = {
    keyResultList: KeyResult[]
}

const KeyResultList = ({ keyResultList }: KeyResultListProps) => {
    return (
        <div>
            {keyResultList.length > 0 && keyResultList.map((item, index) => (
                <div key={index} className="flex flex-col">
                    <p>Description: {item.description}</p>
                    <p>Progress: {item.progress}</p>
                </div>
            ))}
        </div>
    )
}

export default KeyResultList
