import React, { useEffect, useMemo, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import Button from "@mui/material/Button";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Spinner from "../layout/loader/Spinner";
const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  // State to store the form data
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  // State to manage uploaded images and their previews
  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        if (reader.readyState === 2) {
          setImages((prevImages) => [...prevImages, fileContent]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isFocused,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle removing an image
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      images,
    };
    dispatch(createProduct(data));
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removedImage);

    setImages(reorderedImages);
  };

  const style = useMemo(() => {
    const baseStyle = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      borderWidth: 2,
      borderRadius: 2,
      borderColor: "#eeeeee",
      borderStyle: "dashed",
      backgroundColor: "#fafafa",
      color: "#bdbdbd",
      outline: "none",
      transition: "border .24s ease-in-out",
    };

    const focusedStyle = {
      borderColor: "#2196f3",
    };

    const acceptStyle = {
      borderColor: "#00e676",
    };

    const rejectStyle = {
      borderColor: "#ff1744",
    };

    return {
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    };
  }, [isFocused, isDragAccept, isDragReject]);

  const categories = [
    "Laptop",
    "Smartphone",
    "Electronics",
    "Cloths",
    "Home",
    "Beauty",
    "Toys",
    "Health",
    "Groceries",
    "Bags",
    "Shoes",
    "Accessories",
    "Art",
    "Kitchen",
    "Tools",
    "Gifts",
    "Stationery",
    "Watches",
    "Fitness",
    "Outdoor",
    "VideoGames",
    "Cameras",
    "Travel",
    "Phones",
    "Computers",
    "Drones",
    "DIY",
    "Party",
    "Costumes",
    "HomeDecor",
    "Cookware",
    "Sunglasses",
    "BoardGames",
    "Skincare",
    "Perfumes",
    "Grooming",
    "Luggage",
    "Candles",
    "Swimwear",
    "Tea",
    "Coffee",
    "Cooking",
    "Birthday",
    "Anniversary",
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, success]);
  return (
    <>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <Typography component="h2" className="borderedHeading">
          CREATE PRODUCT
        </Typography>
        <SideBar />
        <div className="dashboardContent">
          <div className="newProductContainer">
            <form
              className="createProductForm"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="formInputField">
                <SpellcheckIcon />
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoFocus
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formInputField">
                <AttachMoneyIcon />
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formInputField">
                <StorageIcon />
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formInputField">
                <AccountTreeIcon />
                <select onChange={handleInputChange} name="category">
                  <option>Choose Category</option>
                  {categories.map((cate) => (
                    <option key={cate} value={cate}>
                      {cate}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInputField">
                <DescriptionIcon />

                <textarea
                  placeholder="Product Description"
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  cols={30}
                  rows={2}
                  required
                />
              </div>
              <div id="createProductFormFile">
                <div
                  {...getRootProps({ style, className: "dropZone" })}
                  className="dropZoneContainer"
                >
                  <input {...getInputProps()} />
                  {isDragAccept && <p>All files will be accepted</p>}
                  {isDragReject && <p>Some files will be rejected</p>}
                  {!isDragActive && <p>Drop some files here ...</p>}
                  {!isDragActive && <p>Drag & Drop some files here ...</p>}
                </div>
              </div>
              <div>
                {images.length > 0 && (
                  <div id="createProductFormImage">
                    <h3>Image Previews:</h3>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {images.map((image, index) => (
                              <Draggable
                                key={index}
                                draggableId={`image-${index}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <img
                                      src={image}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        width: "200px",
                                        height: "auto",
                                        marginRight: "10px",
                                      }}
                                    />
                                    <IconButton
                                      onClick={() => handleRemoveImage(index)}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <>
                    <Spinner size={4} />
                    Creating
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;
