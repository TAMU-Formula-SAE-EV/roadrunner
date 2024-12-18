import { ChangeEvent } from "react";

interface GenericSelectProps<KeyType> {
    prompt: string,
    value: KeyType; 
    options: KeyType[],
    setValue: (key: KeyType) => void; 
}

const GenericSelect = <KeyType extends string,>({
    prompt,
    value,
    options,
    setValue,
}: GenericSelectProps<KeyType>): React.ReactElement => {

    
    return <div>
                <label>{prompt}:</label>
                <select
                    value={value}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setValue(e.target.value as KeyType)}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>;
};

export default GenericSelect;