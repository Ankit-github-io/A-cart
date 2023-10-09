import React, { useState, useEffect } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/orderAction";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@mui/icons-material/PinDrop";
import LocationCityTwoToneIcon from "@mui/icons-material/LocationCityTwoTone";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../cart/CheckoutSteps.jsx";
import { toast } from "react-toastify";

const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.shippingInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const shippingSubmit = (e) => {
    e.preventDefault();

    const phoneNumberRegex = /^\d{10}$/; // Regular expression for 10-digit phone number
    const pinCodeRegex = /^\d{6}$/; // Regular expression for 6-digit PIN code

    // Validate address field
    if (address.trim() === "") {
      toast.error("Please enter your address.");
      return;
    }

    // Validate city field
    if (city.trim() === "") {
      toast.error("Please enter your city.");
      return;
    }

    // Validate state field
    if (state.trim() === "") {
      toast.error("Please enter your state.");
      return;
    }

    // Validate country field
    if (country.trim() === "") {
      toast.error("Please enter your country.");
      return;
    }

    // Validate pinCode field
    if (!pinCodeRegex.test(pinCode)) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Validate phoneNo field
    if (!phoneNumberRegex.test(phoneNo)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    // All form fields are valid, proceed with saving the shipping information
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    // Navigate to the confirmation page
    navigate("/order/confirm");
  };
  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo.address);
      setCity(shippingInfo.city);
      setState(shippingInfo.state);
      setCountry(shippingInfo.country);
      setPinCode(shippingInfo.pinCode);
      setPhoneNo(shippingInfo.phoneNo);
    }
  }, [shippingInfo]);

  return (
    <>
      <MetaData title="Shipping Details" />
      <div className="shippingPage">
        <div className="stepper">
          <CheckoutSteps activeStep={0} />
        </div>
        <div className="shippingContainer">
          <div className="shippingBox">
            <h2 className="shippingHeading">Shipping Details</h2>

            <form
              className="shippingForm"
              encType="multipart/form-data"
              onSubmit={shippingSubmit}
            >
              <div>
                <HomeOutlinedIcon />
                <input
                  type="text"
                  placeholder="Address"
                  required
                  autoFocus
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <LocationCityTwoToneIcon />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <PinDropIcon />
                <input
                  type="number"
                  placeholder="Pin Code"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>

              <div>
                <PhoneIcon />
                <input
                  type="number"
                  placeholder="Phone Number"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  size="10"
                />
              </div>

              <div>
                <PublicIcon />
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Country</option>
                  {Country &&
                    Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {country && State.getStatesOfCountry(country).length !== 0 && (
                <div>
                  <TransferWithinAStationIcon />
                  <select
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    {State &&
                      State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <input
                type="submit"
                value="Continue"
                className="shippingBtn"
                disabled={state ? false : true}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;
