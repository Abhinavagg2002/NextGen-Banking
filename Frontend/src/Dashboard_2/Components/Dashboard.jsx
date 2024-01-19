import React, {useState, useEffect} from "react";
import "../Css/Components/Dashboard.css";
import TotalBusiness from "./TotalBusiness";
import Table from "./Table/Table";

const Dashboard = () => {
  const storedData = sessionStorage.getItem('myData');
  const parsedData = JSON.parse(storedData);
  const account_no = parsedData?.account_no;
  const [tableData,setTableData] = useState([]) ;

  useEffect(()=>{
      fetch('http://localhost:4000/history', {
          method: 'POST',
          body: JSON.stringify({account_no}),
          headers: {'Content-Type':'application/json'},
          credentials: 'include',
      }).then(res => {
        res.json().then(userInfo => {
          setTableData(userInfo)
      })
    }
  )
  },[account_no])
  

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="grid">
          <div className="one">
            <TotalBusiness />
          </div>
          <br></br>
          <div className="two">
            <h1>Transaction Table</h1>
            <Table data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
