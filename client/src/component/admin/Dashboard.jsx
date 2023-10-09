import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import { Doughnut, Line } from "react-chartjs-2";
import Loader from "../layout/loader/Loader";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [earningsData, setEarningsData] = useState([]);

  const { loading: productLoading, products } = useSelector(
    (state) => state.products
  );

  const { loading: orderLoading, orders } = useSelector(
    (state) => state.allOrders
  );

  const { loading: userLoading, users } = useSelector(
    (state) => state.allUsers
  );
  // Chart--------------------------------------------------
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
  );
  // Chart--------------------------------------------------

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      const earningsMap = new Map();
      orders.forEach((order) => {
        const date = new Date(order.paidAt).toLocaleDateString();
        if (earningsMap.has(date)) {
          earningsMap.set(date, earningsMap.get(date) + order.totalPrice);
        } else {
          earningsMap.set(date, order.totalPrice);
        }
      });

      const earnings = Array.from(earningsMap).map(([date, amount]) => ({
        date,
        amount,
      }));
      setEarningsData(earnings);
    }
  }, [orders]);

  let totalEarnings = 0;
  earningsData.forEach((item) => {
    totalEarnings += item.amount;
  });
  const lineState = {
    labels: earningsData.map((item) => item.date),
    datasets: [
      {
        label: "Earnings",
        data: earningsData.map((item) => item.amount),
        fill: false,
        borderColor: "tomato",
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  if (!products || !orders || !users) {
    return <Loader />;
  }
  return productLoading || orderLoading || userLoading ? (
    <Loader />
  ) : (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Typography component="h2" className="borderedHeading">
        Dashboard
      </Typography>
      <Sidebar />
      <div className="dashboardContent">
        <div className="dashboardContainer">
          <div className="dashboardSummary">
            <div>
              <p>
                Total Amount <br />
                {totalEarnings.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="dashboardSummaryBox2">
              <Link to="/admin/products">
                <p>Product</p>
                <p>{products && products.length}</p>
              </Link>
              <Link to="/admin/orders">
                <p>Orders</p>
                <p>{orders && orders.length}</p>
              </Link>
              <Link to="/admin/users">
                <p>Users</p>
                <p>{users && users.length}</p>
              </Link>
            </div>
          </div>

          <div className="lineChart">
            <Line data={lineState} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
