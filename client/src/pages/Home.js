import { useState, useEffect } from "react"
import UserDetails from '../components/UserDetails';


const Home = () => {
    const [details, setDetails] = useState(null)

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('/api/details')
            const  json = await response.json()


            if(response.ok) {
                setDetails(json)
            }
        }

        fetchDetails()

         //  2nd arg [] = only runs once after rendering above 
    }, [])


    return (
        <div className="home">
            <div className="details"></div>

                
                {/* see if any data to display and returns so in a template - details.map for a future roles function */}
                {details && details.map(( detail ) => (
                    // output detail values in template return template = ( )
                    <UserDetails detail={detail} key={detail._id} />
                ))}
        </div>
    )
}

export default Home