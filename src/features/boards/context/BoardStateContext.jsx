import { createContext, useContext } from 'react';
import { useBoardState } from '../hooks/useBoardState';

const BoardStateContext = createContext(null);

export const BoardStateProvider = ({ serverBoard, children }) => {
    const state = useBoardState(serverBoard);
    return (
        <BoardStateContext.Provider value={state}>
            {children}
        </BoardStateContext.Provider>
    );
};

export const useBoardContext = () => {
    const context = useContext(BoardStateContext);
    if (!context) {
        throw new Error("useBoardContext must be used within BoardStateProvider");
    }
    return context;
};
