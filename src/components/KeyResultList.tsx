import { useKeyResult } from '../context/KeyResultContext.tsx';

const KeyResultList = () => {
  const { keyResultList } = useKeyResult();

  return (
    <div className="flex flex-col mb-4 mt-4">
      <h1 className="mb-2">
        {keyResultList.length != 0 ? 'Key Results List' : 'No Key Results Added Yet'}
      </h1>
      <ul className="list-disc list-inside">
        {keyResultList.map((kr, index) => (
          <li key={index}>
            {kr.description} - {kr.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};
export default KeyResultList;
