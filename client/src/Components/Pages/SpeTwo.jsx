import React, { useEffect, useState } from "react";
import SPEContent from "../SPEContent";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { Link, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";

function SPETwo() {
  const [updateTeam, setUpdateTeam] = useState({})
  const [team, setTeam] = useState("")
  const [uploadData, setUploadData] = useState(false);
  const [classCode, setClassCode] = useState("")
  const [trimesterCode, setTrimesterCode] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [fsValue, setFsValue] = useState([]);
  const [SPEQuestions, setSPEQuestions] = useState([]);
  const [unitCode, setUnitCode] = useState("");
  const user = useSelector(selectUser);
  const [nameOfUser, setNameofUser] = useState("");
  const [studentID, setStudentID] = useState("");
  const [loading, setLoading] = useState(true);
  const { spe2UnitCode } = useParams();

  var stud = {};

  //When unitCode, classCode, and trimesterCode are set, update the state if initial data from firebase
  useEffect(() => {
    db.collection("teams")
      .where("unitCode", "==", unitCode)
      .where("classCode", "==", classCode)
      .where("trimesterCode", "==", trimesterCode)
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data())

        data.forEach((team) => {
          team.members.forEach((member) => {
            if(member.studentNo === studentID){
              setUpdateTeam(team)
            }
          })
        })
      })
  },[unitCode, classCode, trimesterCode])

  useEffect(() => {
    if(!updateTeam) return

    //Update the survey1Status to submitted stored in state
    updateTeam.members?.forEach(member => {
      if(member.studentNo === studentID){
        member[`${unitCode}survey2Status`] = "submitted"
      }
    })

  },[updateTeam])

  useEffect(() => {
    //This prevents stacking of 2 different unit's SPE questions
    setSPEQuestions([]);

    try {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            const name = data.name;
            const studentID = data.studentID;
            setNameofUser(name);
            setStudentID(studentID);
            setFsValue({ student1ID: studentID, student1Name: name });
            stud['student1ID'] = studentID
            stud['student1Name'] = name 
          }
        });

      db.collection("spe2")
        .where("unitCode", "==", spe2UnitCode)
        .where("trimesterCode", "==", "TMA2022")
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());

          //If there is no data retrieved show page loading for 5ms
          if (data.length === 0) {
            setInterval(() => setLoading(false), 500)
          } 
          //if there is data retrieved set the item and don't show page loading
          else if (data.length !== 0) { 
            data[0].questions.map((question) =>
              setSPEQuestions((prevItem) => [...prevItem, question])
            );
            setUnitCode(data[0].unitCode);
            setLoading(false)
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, [spe2UnitCode]);

  //UseEffect to get the trimesterCode and teamCode of the current user
  useEffect(() => {
    try {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            const studentID = data.studentID;
            return studentID
          }
        })
        .then((studentID) => {
          try{
            db.collection("teams")
            .where("unitCode", "==", unitCode)
            .where("trimesterCode", "==", "TMA2022")
            .get()
            .then((snapshot) => {
              const data = snapshot.docs.map((doc) => doc.data())

              data.forEach((team) => {
                team.members.forEach((member) => {
                  if (member.studentNo === studentID) {
                    setTeam(team)
                    setClassCode(team.classCode);
                    setTrimesterCode(team.trimesterCode);
                    setTeamCode(team.teamCode);

                    var count = 2;

                    team.members.forEach((member, index) => {
                      if(member.studentNo !== studentID){
                        stud[`student${count}Name`] = member.studentName
                        stud[`student${count}ID`] = member.studentNo
                        count++
                      }
                      setFsValue({...fsValue, ...stud})
                    })
                  }
                })
              })
            })
          } catch(err) {
            console.log(err)
          }
        });
      } catch (err) {
        console.log(err)
      }
  }, [unitCode])

  useEffect(() => {

    if (uploadData === true) {

      try {

        //Update whole team collection with new surveyStatus
        db.collection("teams")
        .where("unitCode", "==", unitCode)
        .where("classCode", "==", classCode)
        .where("trimesterCode", "==", trimesterCode)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data())

          data.forEach((team) => {
            team.members.forEach((member) => {
              if(member.studentNo === studentID){

                if(updateTeam){
                  db.collection("teams")
                  .doc(team.teamID)
                  .update(updateTeam)
                }
              }
            })
          })
        })

        //Go to spe1submission collection add submitted form
        db.collection("spe2submissions").add({
          studentID: studentID,
          userID: user.uid,
          studentName: nameOfUser,
          teamCode: teamCode,
          classCode: classCode,
          unitCode: spe2UnitCode,
          trimesterCode: trimesterCode,
          answers: fsValue,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        //Go to feed update user submitted spe form
        db.collection("feed").add({
          userID: user.uid,
          studentID: studentID,
          studentName: nameOfUser,
          unitCode: spe2UnitCode,
          classCode: classCode,
          teamCode: teamCode,
          submission: "SPE 2",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.log(err);
      }

      setUploadData(false);
    }
  }, [fsValue, updateTeam]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFsValue({ ...fsValue, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-[80] h-screen justify-center overflow-auto scroll-smooth">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-[80] h-screen justify-center overflow-auto scroll-smooth">
      {SPEQuestions.length === 0 ? (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#E6ECEF]">
          <h1>SPE not available</h1>
          <h1 className="text-9xl font-extrabold text-[#1A2238] tracking-widest">
            404
          </h1>
          <div className="bg-[#E12945] px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
          <button className="mt-5">
            <Link
              to="/"
              className="relative inline-block text-sm font-medium text-[#E12945] group active:text-orange-500 focus:outline-none focus:ring"
            >
              <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

              <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                <router-link to="/">Go Home</router-link>
              </span>
            </Link>
          </button>
        </div>
      ) : (
        <SPEContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          SPEQuestions={SPEQuestions}
          unitCode={spe2UnitCode}
          nameOfUser={nameOfUser}
          studentID={studentID}
          fsValue={fsValue}
          setFsValue={setFsValue}
          setUploadData={setUploadData}
          formNumber={2}
          team={team}
        />
      )}
    </div>
  );
}

export default SPETwo;
