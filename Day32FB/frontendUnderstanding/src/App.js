import { useState, useEffect } from "react";
import "./App.css";
import { getPosts, getRandomUser } from "./api";
import PostCard from "./components/PostCard";
import UserCard from "./components/UserCard";
import GravitationalVortex from "./components/GravitationalVortex"
function App() {
  const [data, setdata] = useState(null);
  const [userData, setuserData] = useState(null);
  useEffect(() => {
    getPosts().then((posts) => setdata(posts));
  }, []);

  useEffect(() => {
    getRandomUser().then((user) => setuserData(user.results[0]));
  }, []);

  const onshort = () => {
    getRandomUser().then((user) => setuserData(user.results[0]));
  }
  let a = 0;
  return (
    <div className="App">
   <div style={{ width: "100%", height: "100vh", background: "#000" }}>
      <GravitationalVortex
        baseColor="#04FF3F"
        accentColor="#FCFF00"
        density={16}
        dotSize={400}
        speed={16}
        direction="inward"
        hoverSpeed={100}
        scale={79}
        tiltX={35}
        tiltY={0}
        vortex={{ twist: 28, funnel: 54 }}
      />
    </div>
      {userData && <UserCard data={userData} />}

      <button onClick={onshort}>else</button>


<GravitationalVortex
  baseColor="#04FF3F"
  accentColor="#FCFF00"
  density={16}
  dotSize={400}
  speed={16}
  direction="inward"
  hoverSpeed={100}
  scale={79}
  tiltX={35}
  tiltY={0}
  vortex={{ twist: 28, funnel: 54 }}
/>

      {data ? (
        data.map((e) => <PostCard title={e.title} body={e.body} />)
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
}

export default App
