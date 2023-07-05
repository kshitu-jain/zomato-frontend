import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "./apiUrl";
import axios from "axios";
import Header from "./header";

const Home = (props) => {
  let { locationList } = props;
  let [mealList, setMealList] = useState([]);

  let navigate = useNavigate();

  let getMealList = async () => {
    let url = BASE_URL + "/get-meal-type";
    let { data } = await axios.get(url);
    setMealList(data.mealTypesList);
  };

  useEffect(() => {
    getMealList();
    // console.log("mounting");
  }, []);
  return (
    <>
      <main className="container-fluid">
        {/* <!-- header section start --> */}

        <section className="row zom-main-section ">
          <section className="col-12 ">
            <Header logo={false} user={props.user} />

            {/* <!-- main header section start --> */}

            <div className="d-flex flex-column align-items-center p-lg-0">
              <p
                className=" d-flex justify-content-center align-items-center bg-white text-danger display-3 pb-2 m-5 m-lg-0 fw-semibold
                            edu-brand">
                e!
              </p>

              <div className="">
                <p className="h2 fw-medium  mb-lg-4 pb-lg-2 pt-lg-2  mt-2 text-white zom-title">
                  Find the best restaurants,<span className="zom-span"> cafés, and bars</span>
                </p>
              </div>

              {/* <!-- search section start --> */}
              <div className="row  zom-searchpage   ">
                <div className="col-10 d-flex flex-lg-row flex-column justify-content-lg-around  mt-4 pt-1 pt-lg-0 m-3 m-lg-0 pe-lg-3">
                  <div className="row ">
                    <div className="col-lg-12 col-11 mt-lg-0 mt-0 mx-lg-0 mx-1 ">
                      <select type="text" className="form-control rounded-0  zom-locationsearch">
                        <option className="text-size" value="">
                          ---select location---
                        </option>

                        {/* this is below the javascript method in react that is loop to find the location list */}
                        {locationList.map((location, index) => {
                          return (
                            <option key={index} value={location.location_id}>
                              {location.name},{location.city}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="row ps-lg-2  ">
                    <div className="col-lg-12 m-lg-0 ">
                      <div className="zom-inputwithicon mt-lg-0 mt-4 mx-1 ">
                        <i
                          className="fa fa-search edu-searchicon text-muted"
                          aria-hidden="true"></i>
                        <input
                          type="text"
                          className=" form-control rounded-0   me-lg-5 mx-0 ms-0 px-5 zom-restaurantsearch"
                          placeholder="Search for restaurants "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- search end --> */}
            </div>

            {/* <!-- main header section end --> */}
          </section>
        </section>

        {/* <!-- header section end --> */}

        {/* <!-- food section start --> */}

        <article>
          <section className="row">
            <section className="col-12 bg-white p-lg-5 p-2  m-lg-auto ">
              <section className="ms-lg-5 ps-lg-4 pt-lg-0 pt-4 mt-1 ms-4 ps-3  ">
                <div className="">
                  <p className="h2 fw-bold pb-2 edu-quicksearch">
                    <Link to="/search"> Quick Searches</Link>
                  </p>
                </div>
                <div className=" ">
                  <p className="fs-5  pb-lg-1  text-secondary zom-discover">
                    Discover restaurants by type of meal
                  </p>
                </div>
              </section>

              {/* <!-- food options start --> */}

              <section className="row">
                <section className="col-lg-11 col-10 m-auto  d-flex flex-row flex-wrap">
                  {mealList.map((meal, index) => {
                    return (
                      <div
                        onClick={() => {
                          navigate(`/search/${meal.meal_type}/${meal.name}`);
                        }}
                        key={index}
                        className="d-flex edu-food m-3 ">
                        <img src={"/images/" + meal.image} className="edu-foodimg " />
                        <div className="edu-foodinfo px-lg-4 p-lg-0 p-4 m-lg-auto ms-2">
                          <h5 className="edu-breakfast pt-lg-2 fw-bold">{meal.name}</h5>
                          <p className="text-secondary">{meal.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </section>
              </section>

              {/* <!-- food options end --> */}
            </section>
          </section>
        </article>

        {/* <!-- food section end --> */}
      </main>
    </>
  );
};

export default Home;
