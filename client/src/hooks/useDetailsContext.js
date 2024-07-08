import { DetailsContext } from "../context/DetailsContext";
import { useContext } from "react";

export const useDetailsContext = () => {
    const context = useContext(DetailsContext)

    if(!context) {
        throw Error('Details context must be used in details context provider')
    }

    return context
 }