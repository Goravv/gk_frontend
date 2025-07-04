import LogoutButton from "./LogoutUser";
import Navbar from "./Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <LogoutButton/>
    </div>
  );
}

export default Home;
