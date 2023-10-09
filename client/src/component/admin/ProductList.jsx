import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { Typography } from "@mui/material";
import Loader from "../layout/loader/Loader";
import { toast } from "react-toastify";
const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, products, loading } = useSelector((state) => state.products);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct());
  }, [dispatch, error, deleteError, isDeleted, navigate]);
  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 200,
      flex: 0.4,
    },

    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 0.4,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.2,
      minWidth: 110,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 0.2,
      minWidth: 100,
    },

    {
      field: "actions",
      flex: 0.2,
      headerName: "Actions",
      type: "number",
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/product/${params.id}`}>
              <EditIcon />
            </Link>

            <IconButton
              aria-label="delete"
              onClick={() => deleteProductHandler(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <>
      <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className="dashboard">
        <Typography component="h2" className="borderedHeading">
          ALL PRODUCTS
        </Typography>
        <SideBar />
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <div className="dashboardContent">
            <div className="productListContainer">
              <DataGrid
                rows={rows}
                columns={columns}
                className="productListTable"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
