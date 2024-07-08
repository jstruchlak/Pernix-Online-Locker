import { useEffect } from "react"
import UserDetails from '../components/UserDetails';
import UserForm from "../components/UserForm";
import { useDetailsContext } from "../hooks/useDetailsContext";


const Home = () => {
    // invoked from details context where details state is set to null
    // dispatch function attached will fire 'action' to update state
   const {details, dispatch} = useDetailsContext()

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('/api/details')
            const  json = await response.json()


            if(response.ok) {
                // fire the dispatch if all good
                dispatch({type: 'SET_DETAILS', payload: json})
            }
        }

        fetchDetails()

         //  2nd arg [] = only runs once after rendering above 
    }, [dispatch])


    return (
        <div className="home">
            <div className="details">
                {/* see if any data to display and returns so in a template - details.map for a future roles function */}
                {details && details.map(detail => (
                    // output detail values in template return template = ( )
                    <UserDetails detail={detail} key={detail._id} />
                ))}
            </div>
            <UserForm />
        </div>
    )
}

export default Home