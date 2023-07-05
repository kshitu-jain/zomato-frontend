import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./components/apiUrl";
import jwt_decode from "jwt-decode";

const App = () => {
  let getUserDetails = () => {
    let token = localStorage.getItem("zc_auth_token");
    if (token === null) {
      return null;
    } else {
      try {
        let decodedData = jwt_decode(token);
        return decodedData;
      } catch (error) {
        return null;
      }
    }
  };
  let [user, setUser] = useState(getUserDetails());
  let [locationList, setLocationList] = useState([]);

  let getLocationList = async () => {
    try {
      let url = BASE_URL + "/location-list";
      let { data } = await axios.get(url);
      setLocationList(data.locationList);
    } catch (error) {
      alert("server error");
    }
  };

  useEffect(() => {
    getLocationList();
    console.log(user);

    // console.log("mounting");
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home locationList={locationList} user={user} />} />
        <Route
          path="/search/:id/:name"
          element={<Search locationList={locationList} user={user} />}
        />
        <Route path="/restaurant/:id" element={<Restaurant user={user} />} />
      </Routes>
    </>
  );
};

export default App;
