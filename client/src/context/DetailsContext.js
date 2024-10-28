import { createContext, useReducer } from "react";
import React from 'react';

export const DetailsContext = createContext()

export const detailsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DETAILS':
            return {
                details: action.payload
            }
        case 'CREATE_DETAILS':
            // ... spread operator for all to return
            return {
                details: [action.payload, ...state.details]
            }
        case 'DELETE_DETAILS':
            return {
                details: state.details.filter((d) => d._id !== action.payload._id)
            }
        case 'UPDATE_DETAILS':
            return {
                details: state.details.map((d) => (d._id === action.payload._id ? action.payload : d)),
            };
        // if no match above return current state
        default:
            return state
    }
}

// wrap context around whole app inside index.js - make DetailsContext parent to App.js
export const DetailsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(detailsReducer, {
        details: null
    })

    return (
        <DetailsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </DetailsContext.Provider>
    )
}
