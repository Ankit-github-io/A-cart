import React, { useEffect } from "react";
import "./MyOrders.css";
import { Link } from "react-router-dom";
import { clearErrors, myOrders } from "../../actions/orderAction";

import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/Loader";
import { DataGrid } from "@mui/x-data-grid";
import LaunchIcon from "@mui/icons-material/Launch";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { loading, error, orders } = useSelector((state) => state.myOrder);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },

    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      minWidth: 150,
      cellClassName: (params) => {
        const status = params?.row?.status;
        return status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      flex: 0.4,
      minWidth: 150,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 0.4,
      minWidth: 150,
    },

    {
      field: "actions",
      flex: 0.4,
      minWidth: 150,
      headerName: "Action",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params?.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors);
    }
    dispatch(myOrders());
  }, [dispatch, error]);
  return (
    <>
      <MetaData title={`${user.name} Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {orders && orders.length > 0 ? (
            <>
              <div className="myOrdersContainer">
                <DataGrid rows={rows} columns={columns} />
              </div>
            </>
          ) : (
            <>
              <div className="emptyOrder">
                <img
                  src="https://res.cloudinary.com/dhj4i6e2r/image/upload/v1690830547/Empty_mi8xax.gif"
                  alt="Order Empty"
                />
                <Link className="shopNow" to="/products">
                  Shop Now
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MyOrders;
