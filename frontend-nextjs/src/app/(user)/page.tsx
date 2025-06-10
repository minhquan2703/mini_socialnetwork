import { auth } from "@/auth"
import HomePage from "@/components/layout/homepage"

const Home = async() =>{
  const session = await auth();

  return(
    <div>
      <HomePage session={session}/>
    </div>
  )
}
export default Home