import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import TableRow from "../Table/TableRow";
import { Link, useParams } from "react-router-dom";
import TableHead from "../Table/TableHead";
import SectionButton from "../HomeComponents/SectionButton";

function Class({ userInfo, groupName, groupNum }) {
  const user = useSelector(selectUser);
  const { unitId, classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalResult, setFinalResult] = useState([]);
  const [studentNotAdded, setStudentNotAdded] = useState(true)
  const [isDownloadable, setIsDownloadable] = useState(true)

  //Get the unit
  useEffect(() => {
    setLoading(true)
    setStudents([]);

    try {

      if(!unitId && !classId) return

      db.collection("teams")
        .where("unitCode", "==", unitId)
        .where("trimesterCode", "==", "TMA2022")
        .where("classCode", "==", classId)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());

          console.log(data)

          if (data.length === 0) {
            setInterval(() => setLoading(false), 500);
          } 
          else if (data.length !== 0) {
            data.forEach((team) => {

              team.members.forEach((member) => {

                //Disable download button if 1 of the member did not submit
                if(member[`${unitId}survey1Status`] === "not submitted"){
                  setIsDownloadable(false)
                }

                //Check if the student is added to the system 
                db.collection("users")
                  .where("studentID", "==", member.studentNo)
                  .get()
                  .then((snapshot) => {
                    const [data] = snapshot.docs.map((doc) => doc.data());

                    console.log(data)

                    if(data !== undefined){
                      setStudents((prevData) => [
                        ...prevData,
                        {
                          teamName: team.teamName,
                          teamCode: team.teamCode,
                          studentName: data.name,
                          studentEmail: data.email,
                          studentID: data.studentID,
                          [`${unitId}survey1Status`]:member[`${unitId}survey1Status`],
                          [`${unitId}survey2Status`]:member[`${unitId}survey2Status`]
                        },
                      ]);
                      setLoading(false);
                      setStudentNotAdded(false)
                    }
                    else if (data === undefined){ 
                      setStudentNotAdded(true)
                    }
                  });
              });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, [unitId, classId]);


  useEffect(() => {

    if(!unitId) return;

    //Get spe1 submissions
    db.collection("spe1submissions")
      .where("unitCode", "==", unitId)
      .get()
      .then((snapshot) => {
        const spe1Data = snapshot.docs.map((doc) => doc.data());

        var studentDataArr = [];
        let ansAllInfoArr = [];
        var result;

        for(var i = 0; i < spe1Data.length; i++) {
          processStud(i)
        }  

        function processStud(index){
  
          let ansInfoArr = [];

          //Function for adding all names into array
          function addNameToArr(num, index, nameKey){
            for(var j = 0; j < ansInfoArr.length; j++){
              if(ansInfoArr[j][`student${num}ID`]){
                ansInfoArr[j][`student${num}Name`] = spe1Data[index].answers[nameKey]                
              }
            }
          }

          //Function for adding all average score into array
          function addAvgToArr(num, index, avgKey){
            for(var k = 0; k < ansInfoArr.length; k++){
              if(ansInfoArr[k][`student${num}ID`]){
                ansInfoArr[k][`student${num}Avg`] = spe1Data[index].answers[avgKey]                
              }
            }
          }

          for (var IDkey in spe1Data[index].answers) {
            if (IDkey.includes("ID")) {
              ansInfoArr.push({ [IDkey]: spe1Data[index].answers[IDkey], teamCode: spe1Data[index].teamCode });
            }
          }

          for (var nameKey in spe1Data[index].answers) {

            if (nameKey.includes("student1Name")) {     
              
              addNameToArr(1, index, nameKey)

            }
            else if(nameKey.includes("student2Name")){

              addNameToArr(2, index, nameKey)

            }
            else if(nameKey.includes("student3Name")){

              addNameToArr(3, index, nameKey)

            }
            else if(nameKey.includes("student4Name")){

              addNameToArr(4, index, nameKey)

            }
            else if(nameKey.includes("student5Name")){

              addNameToArr(5, index, nameKey)

            }
            else if(nameKey.includes("student6Name")){

              addNameToArr(6, index, nameKey)

            }
          }
          
          for (var avgKey in spe1Data[index].answers) {

            if (avgKey.includes("student1Avg")) {

              addAvgToArr(1, index, avgKey)

            }
            else if(avgKey.includes("student2Avg")){

              addAvgToArr(2, index, avgKey)

            }
            else if(avgKey.includes("student3Avg")){

              addAvgToArr(3, index, avgKey)

            }
            else if(avgKey.includes("student4Avg")){

              addAvgToArr(4, index, avgKey)

            }
            else if(avgKey.includes("student5Avg")){

              addAvgToArr(5, index, avgKey)

            }
            else if(avgKey.includes("student6Avg")){

              addAvgToArr(6, index, avgKey)

            }
          }

          ansInfoArr.forEach((item) => {
            for (let i = 1; i < 7; i++) {
              const obj = {
                ...item,
                studentID: item[`student${i}ID`],
                studentName: item[`student${i}Name`],
                SPE1Avg: item[`student${i}Avg`],
              };
              delete obj[`student${i}ID`];
              delete obj[`student${i}Name`];
              delete obj[`student${i}Avg`];
  
              if (
                obj.studentID !== undefined ||
                obj.studentName !== undefined ||
                obj.SPE1Avg !== undefined
              ) {
       
                ansAllInfoArr.push(obj)
                
              }
            }
          });

          

          // //Convert string studentAvg to number
          for(var l = 0; l < ansAllInfoArr.length; l++) {
            ansAllInfoArr[l].SPE1Avg = parseFloat(ansAllInfoArr[l].SPE1Avg)
          }

            result = [
              ...ansAllInfoArr
                .reduce((a, b) => {
                  if (a.has(b.studentID)){
                    const obj = a.get(b.studentID);
                    obj.SPE1Avg += b.SPE1Avg;
                    a.set(b.studentID, obj);
                  } 
                  else {
                    a.set(b.studentID, {
                      studentID: b.studentID,                 
                      studentName: b.studentName,
                      SPE1Avg: b.SPE1Avg,
                      teamCode: b.teamCode
                    });
                  }
                  return a;
                }, new Map())
                .values(),
            ];
        }

        //Calculate average score of each students
        result.forEach(student => {
          if(student['SPE1Avg']){
            student.SPE1Avg = (student.SPE1Avg / 6).toFixed(2)
          }
        })

        //Return the array and pass to the next
        return result

      }).then((spe1Result) => {

        db.collection("spe2submissions")
        .where("unitCode", "==", unitId)
        .get()
        .then((snapshot) => {
          const spe2data = snapshot.docs.map((doc) => doc.data());


          let ansAllInfoArr = [];
          var result;

          for(var i = 0; i < spe2data.length; i++) {
            processStud(i)
          }      
  
          function processStud(index){
  
            let ansInfoArr = [];

            //Function for adding all names into array
            function addNameToArr(num, index, nameKey){
              for(var j = 0; j < ansInfoArr.length; j++){
                if(ansInfoArr[j][`student${num}ID`]){
                  ansInfoArr[j][`student${num}Name`] = spe2data[index].answers[nameKey]                
                }
              }
            }

            //Function for adding all average score into array
            function addAvgToArr(num, index, avgKey){
              for(var k = 0; k < ansInfoArr.length; k++){
                if(ansInfoArr[k][`student${num}ID`]){
                  ansInfoArr[k][`student${num}Avg`] = spe2data[index].answers[avgKey]                
                }
              }
            }
  
            for (var IDkey in spe2data[index].answers) {
              if (IDkey.includes("ID")) {
                ansInfoArr.push({ [IDkey]: spe2data[index].answers[IDkey], teamCode: spe2data[index].teamCode });
              }
            }
  
            for (var nameKey in spe2data[index].answers) {
  
              if (nameKey.includes("student1Name")) {     
                
                addNameToArr(1, index, nameKey)

              }
              else if(nameKey.includes("student2Name")){
  
                addNameToArr(2, index, nameKey)

              }
              else if(nameKey.includes("student3Name")){
  
                addNameToArr(3, index, nameKey)

              }
              else if(nameKey.includes("student4Name")){
  
                addNameToArr(4, index, nameKey)

              }
              else if(nameKey.includes("student5Name")){
  
                addNameToArr(5, index, nameKey)

              }
              else if(nameKey.includes("student6Name")){
  
                addNameToArr(6, index, nameKey)

              }
            }
            
            for (var avgKey in spe2data[index].answers) {
  
              if (avgKey.includes("student1Avg")) {

                addAvgToArr(1, index, avgKey)

              }
              else if(avgKey.includes("student2Avg")){
  
                addAvgToArr(2, index, avgKey)

              }
              else if(avgKey.includes("student3Avg")){

                addAvgToArr(3, index, avgKey)

              }
              else if(avgKey.includes("student4Avg")){

                addAvgToArr(4, index, avgKey)

              }
              else if(avgKey.includes("student5Avg")){
  
                addAvgToArr(5, index, avgKey)

              }
              else if(avgKey.includes("student6Avg")){
  
                addAvgToArr(6, index, avgKey)

              }
            }
  
            ansInfoArr.forEach((item) => {
              for (let i = 1; i < 7; i++) {
                const obj = {
                  ...item,
                  studentID: item[`student${i}ID`],
                  studentName: item[`student${i}Name`],
                  SPE2Avg: item[`student${i}Avg`],
                };
                delete obj[`student${i}ID`];
                delete obj[`student${i}Name`];
                delete obj[`student${i}Avg`];
    
                if (
                  obj.studentID !== undefined ||
                  obj.studentName !== undefined ||
                  obj.SPE2Avg !== undefined
                ) {
         
                  ansAllInfoArr.push(obj)
                  
                }
              }
            });
  
            // //Convert string studentAvg to number
            for(var l = 0; l < ansAllInfoArr.length; l++) {
              ansAllInfoArr[l].SPE2Avg = parseFloat(ansAllInfoArr[l].SPE2Avg)
            }

            result = [
              ...ansAllInfoArr
                .reduce((a, b) => {
                  if (a.has(b.studentID)){
                    const obj = a.get(b.studentID);
                    obj.SPE2Avg += b.SPE2Avg;
                    a.set(b.studentID, obj);
                  } 
                  else {
                    a.set(b.studentID, {
                      studentID: b.studentID,                 
                      studentName: b.studentName,
                      SPE2Avg: b.SPE2Avg,
                      teamCode: b.teamCode
                    });
                  }
                  return a;
                }, new Map())
                .values(),
            ];

            //Calculate average score of each students
            result.forEach(student => {
              if(student['SPE2Avg']){
                student.SPE2Avg = (student.SPE2Avg / 6).toFixed(2)
              }
            })
          }

          let arrToFilter = [];

          //Push spe 1 results to array to filter
          spe1Result.forEach((record) => {
            arrToFilter.push(record)
          })

          //Push spe 2 results to array to filter
          result.forEach((record) => {
            arrToFilter.push(record)
          })

          //Filter the array so that spe1Avg and spe2Avg belongs to the same person without repeated object
          const finalArr = arrToFilter.reduce((acc, val, ind) => {
              const index = acc.findIndex(el => el.studentID === val.studentID);
              if(index !== -1){
                const key = Object.keys(val)[2];
                acc[index][key] = val[key];
              } else {
                acc.push(val);
              };
              return acc;
          }, []);

          setFinalResult(finalArr);
        })
      })
  },[unitId]);

  if (loading) {
    return (
      <div className="flex flex-col flex-[80] h-screen justify-center overflow-auto scroll-smooth">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-[80] h-screen justify-center overflow-auto scroll-smooth">
      {students.length === 0 || studentNotAdded ? (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#E6ECEF]">
          {studentNotAdded ? <h1>Please add all students for this class</h1> : <h1>No teams added yet</h1> }
          <h1 className="text-9xl font-extrabold text-[#1A2238] tracking-widest">
            404
          </h1>
          <div className="bg-[#E12945] px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
          {studentNotAdded ? 
              <Link
                to="/registerStud"
                className="mt-5 relative inline-block text-sm font-medium text-[#E12945] group active:text-orange-500 focus:outline-none focus:ring"
              >
                <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

                <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                  <router-link to="/registerStud">Add student</router-link>
                </span>
              </Link>
            :
              <Link
                to="/"
                className="mt-5 relative inline-block text-sm font-medium text-[#E12945] group active:text-orange-500 focus:outline-none focus:ring"
              >
                <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

                <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                  <router-link to="/">Go Home</router-link>
                </span>
              </Link>
          }
        </div>
      ) : (
        <div className="flex flex-col flex-[80] h-screen overflow-auto">
          <div className="flex justify-center w-full items-center bg-[#E12945] h-10 p-2 mb-14 text-white sticky top-0">
            <h2>
              {unitId} {classId} team details
            </h2>
          </div>
          <h1>
          <span className="underline underline-offset-1 decoration-[#E12945]">
            Teams
          </span> 
          <span>
          &nbsp;in {unitId} {classId}
          </span>  
           
          </h1>
          <div className="p-10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 bg-white rounded-md">
                <thead>
                  <tr>
                    <TableHead title={"Group"} />
                    <TableHead title={"Team name"} />
                    <TableHead title={"Student No."} />
                    <TableHead title={"Name"} />
                    <TableHead title={"Email"} />
                    <TableHead title={"Form 1 Status"} />
                    <TableHead title={"Action"} />
                    <TableHead title={"Form 2 Status"} />
                    <TableHead title={"Action"} />
                  </tr>
                </thead>

                {/* {students && console.log(students)} */}
                {
                students && (
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student, index) => (
                      <TableRow
                        key={index}
                        name={student.studentName}
                        email={student.studentEmail}
                        memberId={student.studentID}
                        survey1Status={student[`${unitId}survey1Status`]}
                        survey2Status={student[`${unitId}survey2Status`]}
                        group={student.teamCode}
                        teamName={student.teamName}
                      />
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <section>
            <div className=" px-4 pt-16 pb-28 sm:px-6 lg:px-8">
              <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1">
              
                <SectionButton
                  title={"Download output file (only available after all student submitted spe 1)"}
                  link={"/downloadSpe"}
                  content={"Download only available after all students have submitted at least spe 1. If file is downloaded before all students have submitted spe 1 and 2, calculation will be inaccurate."}
                  finalResult={finalResult}
                  unitCode={unitId}
                  disable={isDownloadable}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Class;
