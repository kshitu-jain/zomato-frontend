import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "./apiUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./header";

const Search = (props) => {
  let { locationList } = props;
  let { id, name } = useParams();
  let navigate = useNavigate();

  let [filterData, setfilterData] = useState({
    mealType: id,
    sort: 1,
  });

  let [restaurants, setRestaurants] = useState([]);

  // mealType, loc_id, lCost, hCost, sort, cuisine, page, itemsPerPage

  let getFilterData = async () => {
    let url = BASE_URL + "/filter";
    let { data } = await axios.post(url, filterData);
    setRestaurants(data.filterResult);
  };

  let setFilterPage = (event) => {
    let { name, value } = event.target;
    console.log(name, value);

    switch (name) {
      case "sort":
        setfilterData({ ...filterData, sort: Number(value) });
        break;

      case "cost":
        let array = value.split("-");
        console.log(array);
        setfilterData({ ...filterData, lCost: array[0], hCost: array[1] });
        break;

      case "location":
        if (value == "") {
          delete filterData.loc_id;
          setfilterData({ ...filterData });
        } else {
          setfilterData({ ...filterData, loc_id: Number(value) });
        }
        break;

      case "cuisine":
        let cuisineFilter = filterData.cuisine
          ? filterData.cuisine.map((value) => {
              return value.name;
            })
          : null;

        console.log({ ...filterData, cuisineFilter: value });
        break;
    }
  };

  useEffect(() => {
    getFilterData();
  }, [filterData]);

  return (
    <>
      <div className="bg-danger">
        <Header logo={false} user={props.user} />
      </div>

      {/* //  <!-- this is 2nd section --> */}
      <header className="header1">
        <h1 className="h1">Breakfast Places in Mumbai</h1>
      </header>

      {/* //  <!-- this is 3rd section --> */}

      <section className="mainsection-2">
        <section className="filter">
          <div className="space">
            <p className="text-color filtersize">Filters</p>

            <div className="search-option">
              <label className="text-color locationsize">Select location</label>
            </div>

            <div className="search-option">
              <select className="tagline" name="location" onChange={setFilterPage}>
                <option className="" value="">
                  ---select location---
                </option>
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

          {/* <!-- this is cuisine section --> */}
          <div className="space">
            <div className="space-between">
              <p className="text-color space-between ">Cuisine</p>
            </div>
            <div className="space-between">
              <input
                type="checkbox"
                className="checkbox"
                name="cuisine"
                value="north-Indian"
                onChange={setFilterPage}
              />
              <label className="text-color2">North Indian</label>
            </div>
            <div className="space-between">
              <input
                type="checkbox"
                className="checkbox"
                name="cuisine"
                value="south-Indian"
                onChange={setFilterPage}
              />
              <label className="text-color2">South Indian</label>
            </div>
            <div className="space-between">
              <input
                type="checkbox"
                className="checkbox"
                name="cuisine"
                value="chinese"
                onChange={setFilterPage}
              />
              <label className="text-color2">Chinese</label>
            </div>
            <div className="space-between">
              <input
                type="checkbox"
                className="checkbox"
                name="cuisine"
                value="fast-food"
                onChange={setFilterPage}
              />
              <label className="text-color2">Fast Food </label>
            </div>
            <div className="space-between">
              <input
                type="checkbox"
                className="checkbox"
                name="cuisine"
                value="street-food"
                onChange={setFilterPage}
              />
              <label className="text-color2">Street Food </label>
            </div>
          </div>
          {/* <!-- this is price section --> */}
          <div className="space">
            <div className="space-between">
              <p className="text-color space-space-between">Cost for two</p>
            </div>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                name="cost"
                value="0-500"
                onChange={setFilterPage}
              />
              <label className="text-color2"> Less than 500</label>
            </div>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                name="cost"
                value="500-1000"
                onChange={setFilterPage}
              />
              <label className="text-color2"> 500 to 1000</label>
            </div>

            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                name="cost"
                value="1000-1500"
                onChange={setFilterPage}
              />
              <label className="text-color2"> 1000 to 1500</label>
            </div>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                name="cost"
                value="1500-2000"
                onChange={setFilterPage}
              />
              <label className="text-color2"> 1500 to 2000</label>
            </div>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                name="cost"
                value="2000-9999"
                onChange={setFilterPage}
              />
              <label className="text-color2">2000+</label>
            </div>
          </div>

          {/* <!--this is sort section  --> */}
          <div className="space">
            <h3 className="h3 space-between">Sort</h3>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                value="1"
                name="sort"
                checked={filterData == 1 ? true : false}
                onChange={setFilterPage}
              />
              <label className="text-color2">Price low to high</label>
            </div>
            <div className="space-between">
              <input
                type="radio"
                className="form-check-input"
                value="-1"
                name="sort"
                checked={filterData == -1 ? true : false}
                onChange={setFilterPage}
              />
              <label className="text-color2">Price high to low</label>
            </div>
          </div>
        </section>

        {/* <!--this is shop section  --> */}
        <article className="shop">
          {/* <!-- this si first section of article --> */}
          {restaurants.length == 0 ? (
            <>
              <p className="text-center text-danger h1">NO RESULT FOUND</p>
            </>
          ) : (
            restaurants.map((restaurant, index) => {
              return (
                <section
                  onClick={() => navigate("/restaurant/" + restaurant._id)}
                  key={index}
                  className="shop-1">
                  <div className=" shop-1-info">
                    <div className="img">
                      <img src="/images/assets/breakfast.png" />
                    </div>
                    <div className="info">
                      <h1 className="text-color bake">{restaurant.name}</h1>
                      <p className="text-color fort">{restaurant.locality}</p>
                      <p className="text-color plot-D">{restaurant.city}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="shop-1-info-2">
                    <div className="cuisines">
                      <p className="text-color text-size">CUISINES:</p>
                      <p className="text-color text-size">COST FOR TWO:</p>
                    </div>
                    <div className="bakery">
                      <p className="text-size2">
                        {restaurant.cuisine
                          .map((value) => {
                            return value.name;
                          })
                          .join(", ")}
                      </p>
                      <p className="text-size2">{restaurant.min_price}</p>
                    </div>
                  </div>
                </section>
              );
            })
          )}

          {/* <!-- this si 3rd section of article --> */}
          <section className="navigation">
            <div className="nav"> {`<`} </div>
            <div className="nav ">1</div>
            <div className="nav">2</div>
            <div className="nav"> {`>`} </div>
          </section>
        </article>
      </section>
    </>
  );
};

export default Search;
