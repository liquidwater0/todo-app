import { useState, useEffect, Dispatch, SetStateAction } from "react";

function getSavedValue<T>(storageKey: string, initialValue: T) {
    const savedValue = localStorage.getItem(storageKey);
    if (!savedValue) return initialValue;
    return JSON.parse(savedValue);
}

export function useLocalStorage<T>(storageKey: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(() => getSavedValue(storageKey, initialValue));

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value]);
    
    return [value, setValue];
}