// pages/RecordAnalysis.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RateECGChart from '../components/Analysis/analysischart';
import ProductSummaryCards from '../components/Analysis/analysisProduct';
import LoadingSpinner from "../components/Loadong";


const RecordAnalysis = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || "";
  const [product,setproduct]=useState([]);



//get line chart data
  useEffect(() => {
    if (!userId) return;
  
    axios.get(`${import.meta.env.VITE_BACKEND_URI}/user/rates/${userId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setRecords(res.data);
        setLoading(false)
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [userId]);


  //get product data
  useEffect(() => {
    if (!userId) return;
  
    axios.get(`${import.meta.env.VITE_BACKEND_URI}/user/product/${userId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setproduct(res.data);
        setLoading(false)
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [userId]);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ background: 'white', padding: '20px', minHeight: '100vh' }}>
      <h2>Records Overview</h2>
      <ProductSummaryCards product={product}/>
      <RateECGChart records={records} />
    </div>
  );
};

export default RecordAnalysis;
