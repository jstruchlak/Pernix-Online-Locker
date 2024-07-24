import { useEffect } from "react"
import { useDetailsContext } from "../hooks/useDetailsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import config from "../config";

// components
import UserDetails from '../components/UserDetails';
import UserForm from "../components/UserForm";


const Home = () => {
    // invoked from details context where details state is set to null
    // dispatch function attached will fire 'action' to update state
   const {details, dispatch} = useDetailsContext()
   const { user } = useAuthContext()

    useEffect(() => {
        const fetchDetails = async () => {
            // response must contain Authorization token use backticks and access user vairable from useAuthContext
            const response = await fetch(`${config.apiServer}/api/details`, {
                headers: {'Authorization': `Bearer ${user.token}`},
              })
              const json = await response.json()


            if(response.ok) {
                // fire the dispatch if all good
                dispatch({type: 'SET_DETAILS', payload: json})
            }
        }


        // checks if there is a user from AuthContext
        if(user) {
            fetchDetails()
        }

     //  make user from AuthContext a dispatch dependency
    }, [dispatch, user])


    return (
        <div className="home">
          <div className="details">
            {details &&
              details.map((detail) => (
                <UserDetails key={detail._id} detail={detail} />
              ))}
          </div>
          {/* Hide UserForm if there are details to display */}
          {details && details.length === 0 && <UserForm />}
        </div>
      );
    };
    export default Home;
