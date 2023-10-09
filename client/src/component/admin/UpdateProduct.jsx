import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import Button from "@mui/material/Button";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loader from "../layout/loader/Loader";
import { toast } from "react-toastify";
import { Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Spinner from "../layout/loader/Spinner";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error,
    product,
    loading: productDetailsLoading,
  } = useSelector((state) => state.productDetails);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [productData, setProductData] = useState({
    name: product?.name,
    description: product?.description,
    price: product?.price,
    category: product?.category,
    stock: product?.stock,
  });
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
  const { id: productId } = useParams();

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    }
    if (!product) {
      dispatch(getProductDetails(productId));
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, productId, product, updateError]);

  useEffect(() => {
    if (product) {
      setProductData({
        name: product?.name,
        description: product?.description,
        price: product?.price,
        category: product?.category,
        stock: product?.stock,
      });
    }
  }, [product]);
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      images,
    };
    dispatch(updateProduct(productId, data));
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
  return (
    <>
      <MetaData title="Update Product" />

      <div className="dashboard">
        <Typography component="h2" className="borderedHeading">
          UPDATE PRODUCT
        </Typography>
        <SideBar />
        <div className="dashboardContent">
          {productDetailsLoading ? (
            <Loader />
          ) : (
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
                  />
                </div>

                <div className="formInputField">
                  <AttachMoneyIcon />
                  <input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Price"
                    onChange={handleInputChange}
                    value={productData.price}
                  />
                </div>
                <div className="formInputField">
                  <StorageIcon />
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    min={0}
                    value={productData.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="formInputField">
                  <AccountTreeIcon />
                  <select
                    name="category"
                    onChange={handleInputChange}
                    placeholder="Choose Category"
                  >
                    <option> Select Category</option>
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
                    id="description"
                    name="description"
                    placeholder="Product Description"
                    value={productData.description}
                    onChange={handleInputChange}
                    cols="30"
                    rows="2"
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
                    {isDragActive && <p>Drop some files here ...</p>}
                    {!isDragActive && <p>Drag & Drop some files here ...</p>}
                  </div>
                </div>
                {images.length > 0 ? (
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
                ) : (
                  <div id="createProductFormImage">
                    <h3>Image Previews:</h3>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {product?.images.map((image, index) => (
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
                                      src={image?.url}
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
                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <>
                      <Spinner size={4} />
                      Updating
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
