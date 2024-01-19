import React,{useEffect, useState} from "react";
import "../Css/Components/TotalBusiness.css";
import { BsCurrencyDollar, BsPeople } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiRadioButtonLine } from "react-icons/ri";

const TotalBusiness = () => {
  const storedData = sessionStorage.getItem('myData');
  const parsedData = JSON.parse(storedData);
  const account_no = parsedData?.account_no;
  const [a,sa] = useState(0);
  const [b,sb] = useState(0);
  const total = [
    {
      number: `${a}`,
      title1: "Account Balance",
    },
    {
      number: `${b}`,
      title1: "Loan Taken",
    }
  ];

  useEffect(()=>{
    fetch('http://localhost:4000/amount', {
        method: 'POST',
        body: JSON.stringify({account_no}),
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
    }).then(res => {
      res.json().then(userInfo => {
        sa(userInfo[0])
        sb(userInfo[1]);
    })
  }
)
},[account_no])

  
  return (
    <>
      <div className="row_boxes">
        {total.map((totalitems, index) => {
          return (
            <div className="row_boxes_inner" key={index}>
              <div className="first">
                <p className="number">{totalitems.number}</p>
                <p className="title">{totalitems.title1}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default TotalBusiness;
