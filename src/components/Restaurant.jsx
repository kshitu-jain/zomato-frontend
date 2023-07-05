import axios from "axios";
import { BASE_URL } from "./apiUrl";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Header from "./header";

const Restaurant = (props) => {
  let { id } = useParams();
  let [rDetails, setrDetails] = useState({});
  let [menuItems, setMenuItems] = useState([]);
  let [total, setTotal] = useState(0);

  let [name, setName] = useState(props.user ? props.user.name : "");
  let [email, setEmail] = useState(props.user ? props.user.email : "");
  let [mobile, setMobile] = useState("9999999999");
  let [address, setAddress] = useState("pune");

  let getRestaurantDetails = async () => {
    let url = BASE_URL + "/restaurant-list-by-rest-id/" + id;
    let { data } = await axios.get(url);
    setrDetails(data.restList);
  };

  let getMenuItems = async () => {
    let url = BASE_URL + "/menu-items-by-rest-id/" + id;
    let { data } = await axios.get(url);
    setTotal(0);
    setMenuItems(data.menuList);
  };

  let addQty = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty += 1;
    let newTotal = _menuItems[index].price + total;
    setTotal(newTotal);
    setMenuItems(_menuItems);
  };

  let removeQty = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty -= 1;
    let newTotal = total - _menuItems[index].price;
    setTotal(newTotal);
    setMenuItems(_menuItems);
  };

  let makePayment = async () => {
    //hit the order details API
    let url = BASE_URL + "/gen-order-details";
    let { data } = await axios.post(url, { amount: total });

    if (data.status === false) {
      alert("Unable to create Order details");
      return false;
    }

    let { order } = data;
    var options = {
      key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Kshitu Zomato clone",
      description: "Online Food Delivery",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Square_zomato_logo_new.png?20180511061014",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async (response) => {
        let userOrders = menuItems.filter((menu_item) => {
          return menu_item.qty > 0;
        });

        let sendData = {
          pay_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          orders: userOrders,
          name: name,
          email: email,
          contact: mobile,
          address: address,
          totalAmount: total,
          rest_id: rDetails._id,
          rest_name: rDetails.name,
        };

        let url = BASE_URL + "/verify-payments";
        let { data } = await axios.post(url, sendData);
        if (data.status === true) {
          alert("Payment done successfully");
        } else {
          alert("Payment Fail, try again.");
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: mobile,
      },
    };
    var razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    razorpay.open(); //payment window of razorpay
  };

  useEffect(() => {
    getRestaurantDetails();
    getMenuItems();
  }, []);

  return (
    <>
      {/* modal for image gallery */}
      <div className="modal fade" id="slideshow" tabIndex="-1">
        <div className="modal-dialog " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div
              className="modal-body carousel-body "
              centerMode={true}
              centerSlidePercentage="50%">
              {rDetails.thumb ? (
                <Carousel showThumbs={false} infiniteLoop={true}>
                  {rDetails.thumb.map((value, index) => {
                    return (
                      <div key={index} className="image-height">
                        <img src={"/images/" + value} alt="" />
                      </div>
                    );
                  })}
                </Carousel>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* modal for menus */}
      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModalMenu" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 " id="exampleModalLabel">
                {rDetails.name} Menus
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            {menuItems.map((item, index) => {
              return (
                <div key={index} className="modal-body d-flex justify-content-between">
                  <div className="">
                    <p className="fw-bold">{item.name}</p>
                    <p>Rs {item.price}</p>
                    <p className=" text-black-50">{item.description}</p>
                  </div>
                  <div className=" menu-food-item d-flex flex-column  align-items-end pe-3 py-3">
                    <div>
                      <img className="modal-image mb-2" src={"/images/" + item.image} />
                    </div>

                    {item.qty > 0 ? (
                      <div className="count-button">
                        <button className="hand" onClick={() => removeQty(index)}>
                          -
                        </button>
                        <button className=" px-2 mx-1 qty">{item.qty}</button>
                        <button className="hand" onClick={() => addQty(index)}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-primary border-0 text-white add-button"
                        onClick={() => addQty(index)}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="modal-footer d-flex justify-content-between ">
              <h4 className="">Total {total}</h4>
              <div className="">
                <button type="button" className="btn bg-danger me-3" data-bs-dismiss="modal">
                  Back
                </button>
                {total > 0 ? (
                  <button
                    type="button"
                    className="btn bg-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalUser">
                    Process
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* user modal */}
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalUser"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {rDetails.name}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div>
                  <label htmlFor="" className="form-label ">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </div>

                <div className="mt-2">
                  <label htmlFor="" className="mt-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control mt-2"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </div>

                <div className="mt-2">
                  <label htmlFor="" className="mt-2">
                    Address
                  </label>
                  <textarea
                    className="form-control mt-2"
                    rows="3"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                    }}></textarea>
                </div>
              </form>
            </div>
            <div className="mt-2 modal-footer">
              <button
                type="button"
                className="btn bg-danger"
                data-bs-dismiss="modal"
                data-bs-target="#exampleModalMenu"
                data-bs-toggle="modal">
                Back
              </button>
              <button type="button" className="btn bg-primary" onClick={makePayment}>
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* main start here*/}
      <main className="container-fluid">
        <main className="row">
          {/* <!-- header section --> */}
          <div className="bg-danger">
            <Header logo={false} user={props.user} />
          </div>

          {/* <!-- ******************************restaurant details section***************************** --> */}

          <section className="col-10 m-auto">
            {/* <!-- img section --> */}
            <div className="position-relative mb-4">
              <img className="food-image" src={"/images/" + rDetails.image} />
              <div className=" h-100 d-flex justify-content-end align-items-end pe-3 pb-3">
                <button
                  className="click-button py-2 px-3 m-3 position-absolute"
                  data-bs-toggle="modal"
                  data-bs-target="#slideshow">
                  Click to see Image Gallery
                </button>
              </div>
            </div>

            {/* <!-- resto header section --> */}
            <div>
              <h1 className="resto-heading h2 fw-bold pt-2">{rDetails.name}</h1>
            </div>
            {/* <!-- *****************nav and button section************************ --> */}
            <div className="d-flex flex-row justify-content-between pt-4">
              {/* <!-- link section --> */}
              <section className="dropdown">
                <ul className="list-unstyled d-flex mt-4 mb-0 gap-5">
                  <li>
                    <p className="pe-3 list h5 fw-bold">Overview</p>
                  </li>
                  <li>
                    <p className="list h5 fw-bold">Contact</p>
                  </li>
                </ul>
              </section>
              {/* <!-- button of online order section --> */}
              <div className="">
                <button
                  type="button"
                  className="btn bg-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalMenu"
                  disabled={props.user ? false : true}>
                  {props.user ? "Menu Items" : "Login for menu"}
                </button>
              </div>
            </div>
            <hr className="mt-0" />

            {/* <!-- details section --> */}
            <div className="pt-3">
              <p className="resto-heading h5 fw-bold">About This Place</p>
            </div>
            <div className="pt-4 mt-1">
              <article className="pb-2">
                <p className="h6 fw-bold cuisine">Cuisine</p>
                <p className="cuisine fw-medium pt-1">
                  {rDetails.cuisine
                    ? rDetails.cuisine
                        .map((value) => {
                          return value.name;
                        })
                        .join(", ")
                    : null}
                </p>
              </article>
              <article>
                <p className="h6 fw-bold cuisine">Min Cost</p>
                <p className="cuisine fw-medium pt-1">₹{rDetails.min_price}</p>
              </article>
            </div>

            <div className="pt-4 mt-1">
              <article className="pb-2">
                <p className="h6 fw-bold cuisine">Phone Number</p>
                <p className="text-danger">{rDetails.contact_number}</p>
              </article>
              <article>
                <p className="h6 fw-bold cuisine">{rDetails.name}</p>
                <p className="cuisine address pt-1">
                  {rDetails.locality}, {rDetails.city}
                </p>
              </article>
            </div>
          </section>
          {/* <!-- end here --> */}
        </main>
      </main>
      ;
    </>
  );
};

export default Restaurant;
