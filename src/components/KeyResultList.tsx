import { useContext } from 'react'
import { KeyResultContext } from '../provider/KeyResultProvider'

const KeyResultList = () => {
    const {keyResultList} = useContext(KeyResultContext);
    
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
