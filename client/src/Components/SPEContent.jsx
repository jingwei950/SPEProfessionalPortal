import React, { useContext, useEffect, useState } from "react";
import IntroCard from "./Card/IntroCard";
import EachStudSPE from "./EachStudSPE";
import toast from "react-hot-toast";
import $ from "jquery";
import { CheckBtnContext } from "../context/CheckBtnContext";

function SPEContent({
  SPEQuestions,
  handleSubmit,
  handleChange,
  formNumber,
  unitCode,
  nameOfUser,
  studentID,
  fsValue,
  setFsValue,
  setUploadData
}) {

  const emptyStudArr = [
    {
      studentNo: "",
      studentName: "",
    },
    {
      studentNo: "",
      studentName: "",
    },
    {
      studentNo: "",
      studentName: "",
    },
    {
      studentNo: "",
      studentName: "",
    },
    {
      studentNo: "",
      studentName: "",
    },
    {
      studentNo: "",
      studentName: "",
    },
  ];

  var checkedArr =[];

  const sucessMsg = (msg, toastHandler = toast) => {
    toastHandler.success(msg, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };


  //When the page is re-rendered, set the default state of cardID to show 1st page of form
  useEffect(() => {
    setCardID(0);
  }, [unitCode]);

  const [cardID, setCardID] = useState(0);
  const [noOfStudents, setNoOfStudents] = useState(emptyStudArr);

  //When use clicks next button automatically go to top of page
  useEffect(() => {
    scrollUp();
  }, [cardID]);

  function formDisplay() {
    if (cardID === 0) {
      return <IntroCard SPENumber={formNumber} unitCode={unitCode} />;
    } else if (cardID === 1) {
      return (
        <EachStudSPE
          SPEQuestions={SPEQuestions}
          handleChange={handleChange}
          nameOfUser={nameOfUser}
          studentID={studentID}
          student={"student1"}
        />
      );
    } else if (cardID >= 2) {
      const studForm = noOfStudents.map((student, index) => (
        <EachStudSPE
          key={index}
          SPEQuestions={SPEQuestions}
          handleChange={handleChange}
          fsValue={fsValue}
          student={`student${index + 1}`}
          id={index}
        />
      ));
      return studForm[cardID - 1];
    }
  }

  function scrollUp() {
    document.getElementById("SPEContent").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleNextClick(e) {
    if (cardID === 0) {
      setCardID((currPage) => currPage + 1);
      scrollUp();
    }

    var radioArr = [];
    var txtArr = [];
    var filledArr = [];

    if (cardID === 1) {

      //Get all the radio buttons
      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let studentArr = [];
        let count = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("Rating")){
            count++;
            studentArr.push(parseFloat(fsValue[key]))
          }
          const total = studentArr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)

          setFsValue({ ...fsValue, student1Avg: (total/count).toFixed(2) })  
        });

        setCardID((currPage) => currPage + 1);
        scrollUp();
      } 

    } else if (cardID === 2) {

      //Get all the radio buttons
      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let student1Arr = [];
        let count = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("student2") && key.includes("Rating")){

            count++;
            student1Arr.push(parseFloat(fsValue[key]))
          }
          const total = student1Arr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)
          setFsValue({ ...fsValue, student2Avg: (total/count).toFixed(2) })
        });

        setCardID((currPage) => currPage + 1);
        scrollUp();
      }
    } else if (cardID === 3) {
      
      //Get all the radio buttons
      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let studentArr = [];
        let count = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("student3") && key.includes("Rating")){
            count++;
            studentArr.push(parseFloat(fsValue[key]))
          }
          const total = studentArr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)
          setFsValue({ ...fsValue, student3Avg: (total/count).toFixed(2) })
        });

        setCardID((currPage) => currPage + 1);
        scrollUp();
      }
    } else if (cardID === 4) {

      //Get all the radio buttons
      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let studentArr = [];
        let count = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("student4") && key.includes("Rating")){
            count++;
            studentArr.push(parseFloat(fsValue[key]))
          }
          const total = studentArr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)
          setFsValue({ ...fsValue, student4Avg: (total/count).toFixed(2) })
        });

        setCardID((currPage) => currPage + 1);
        scrollUp();
      }
    } else if (cardID === 5) {
      
      //Get all the radio buttons
      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let studentArr = [];
        let count = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("student5") && key.includes("Rating")){
            count++;
            studentArr.push(parseFloat(fsValue[key]))
          }
          const total = studentArr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)
          setFsValue({ ...fsValue, student5Avg: (total/count).toFixed(2) })
        });

        setCardID((currPage) => currPage + 1);
        scrollUp();
      }
    } 
    
    else if (cardID === 6) {

      $("*[id*=radioBtn]").each((i, e) => {
        radioArr.push(e.name)
      })
      
      //Get all the text area
      $("*[id*=txtarea]").each((i, e) => {
          txtArr.push(e.name)
      })

      //Set a new array of radio buttons with unique names only
      const uniqueBtnArr = [...new Set(radioArr)]
      
      //Set the checked array with only checked radio buttons
      $("*[id*=radioBtn]:checked").each((i,e) => {
        checkedArr.push(e.id)
      })

      //Set the filled array with on filled text area
      $("*[id*=txtarea]").each((i,e) => {
        if(e.value !== ""){
          filledArr.push(e.name)
        }
      })

      //Check if the 2 arrays have the same length, otherwise alert user
      if(uniqueBtnArr.length !== checkedArr.length || txtArr.length !== filledArr.length){
        alert("Please check and fill up all the fields")
        scrollUp();
      }
      else{
        let studentArr = [];
        let count = 0;
        let total = 0;
  
        Object.keys(fsValue).forEach(key => {
          if(key.includes("student6") && key.includes("Rating")){
            count++;
            studentArr.push(parseFloat(fsValue[key]))
          }

          total = studentArr.reduce((acc, curValue) =>{
            return acc + curValue;
          }, 0)
        });


        (() => {
          setFsValue({ ...fsValue, student6Avg: (total/count).toFixed(2) })
          setUploadData(true)
        })()

        
        handleSubmit(e);
        setCardID(0);
        sucessMsg(`Self & Peer Evaluation ${formNumber} form submitted!`);
      }
    }


  }

  return (
      <div className="flex items-center flex-col overflow-auto scroll-smooth pb-10" id="SPEContent">
        <div className="flex justify-center w-full items-center bg-[#E12945] h-10 p-2 text-white sticky top-0">
          <h2>Self & Peer Evaluation form {formNumber}</h2>
        </div>
        <div className=" p-8 flex flex-col items-center w-full">
          <div id="SPEContainer" className="flex flex-col items-center">
            <div id="cards">
              <form
                action=""
                onSubmit={handleSubmit}
                className="w-full"
                method="post"
                encType="multipart/form-data"
                id="myForm1"
              >

              {formDisplay()}

                <div
                  id="btnContainer"
                  className="flex flex-row w-3/5 my-4 mx-auto justify-center"
                >

                  {cardID !== 6 ? (
                    <button
                      type="button"
                      onClick={handleNextClick}
                      className="relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-[#5C7B88] rounded group focus:outline-none focus:ring"
                    >
                      <span className="absolute right-0 transition-transform translate-x-full group-hover:-translate-x-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <line x1="15" y1="16" x2="19" y2="12"></line>
                          <line x1="15" y1="8" x2="19" y2="12"></line>
                        </svg>
                      </span>
                      <span className="text-sm font-medium transition-all group-hover:mr-4">
                        Next
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleNextClick(e)}
                      className="relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-[#5C7B88] rounded group focus:outline-none focus:ring"
                    >
                      <span className="absolute right-0 transition-transform translate-x-full group-hover:-translate-x-4">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                      <span className="text-sm font-medium transition-all group-hover:mr-4">
                        Submit
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default SPEContent;
