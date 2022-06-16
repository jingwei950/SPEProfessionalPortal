// import React, { useEffect, useState } from "react";
// import Card from "./Card/Card";
// import Home from "./Home";
// import NavBar from "./NavBar/NavBar";
import SpeOne from "../Components/Pages/SpeOne";
import NavBar from "../Components/NavBar/NavBar";
import SpeTwo from "../Components/Pages/SpeTwo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import toast, { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import { useEffect, useState } from "react";
import { db } from '../firebase';
import Group from "./Pages/Group";
import AddSPE1 from "./Pages/AddSPE1";
import AddSPE2 from "./Pages/AddSPE2";

function Content() {
  // const [login, setLogin] = useState(false);
  // const [data, setData] = useState({username:'', role:''});
  const user = useSelector(selectUser);
  const [unitGroupName, setUnitGroupName] = useState([])
  const [unitGroupNum, setUnitGroupNum] = useState([])
  const [unitGroup, setUnitGroup] = useState([])
  const [members, setMembers] = useState("");
  const [userInfo, setUserInfo] = useState("");
  // const dispatch = useDispatch();
  // const [userDetails, setUserDetails] = useState({name: '', email: '', role: ''});

  //Welcome toast
  const welcomeUser = (userName, toastHandler = toast) => {
    toastHandler.success(
      `Welcome,  ${userName}!`,
    {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    })
  }

  //Get the current logged in user from firebase and send a welcome toast message
  useEffect(() => {
    if (!user) return;

    try{
      db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if(doc.exists){
          const nameData = doc.data().name;
          return nameData
        }
      }).then((nameData) => {
        welcomeUser(nameData);
    })
    }
    catch(err){
      console.log(err)
    }
  }, []);

  //Get the unit ICT302 
  useEffect(() => {
    try {
      db.collection("unit")
        .doc("ICT302")
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log(doc.data())

            //Set unit group number
            doc.data().group.map((group) => setUnitGroupNum((unitGroup) => [...unitGroup, group.groupNumber]))

            //Set unit group names
            doc.data().group.map((group) => setUnitGroupName((unitGroup) => [...unitGroup, group.groupName]))          

            //Set unit group members
            doc.data().group.map((group) => {
             return group.member.map((member) => {
                return setMembers((members) => [...members, member])
              })
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

   useEffect(() => {
    if(!members) return;
    try {
      members.map((member) => {
        return db.collection("users")
          .doc(member.id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserInfo((userInfo) => [...userInfo, doc.data()]);
            }
          });
      });
    }
    catch(err){
      console.log(err)
    }
  }, [members]);

  //Test code
  useEffect(() => {
    try {
      db.collection("unit").where("trimesterCode", "==", "TMA2022")
        // .doc("ICT302")
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            // console.log(doc.data().group)
            return doc.data().group.map((group) => console.log(group.member))
          })
        })
        // .then((doc) => {
        //   if (doc.exists) {
        //     console.log(doc.data())

            //Set unit group number
            // doc.data().group.map((group) => setUnitGroupNum((unitGroup) => [...unitGroup, group.groupNumber]))

            //Set unit group names
            // doc.data().group.map((group) => setUnitGroupName((unitGroup) => [...unitGroup, group.groupName]))          

            //Set unit group members
            // doc.data().group.map((group) => {
            //   group.member.map((member) => {
            //     setMembers((members) => [...members, member])
            //   })
            // });
          // }
        // });
      // const teamId = db.collection("unit").where("unitCode", "==", "ICT302").get()
      // .then((snapshot) => {
      //   const id = snapshot.docs.map((doc) => (
      //     doc.id
      //   ));
      //   console.log(id)
      // });
      // db.collection(teamId).get().then((snapshot) => {
      //   console.log(snapshot)
        // const id = snapshot.docs.map((doc) => (
        //   doc.id
        // ));
        // console.log(id)
      // });
      

    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="app_body flex flex-row font-['Montserrat'] bg-[#E6ECEF]">
      {/* {unitGroup && unitGroup.map((group) => group.group.map((groupName) => console.log(groupName.groupName)))} */}
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/spe1" element={<SpeOne />} />
          <Route path="/spe2" element={<SpeTwo />} />
          <Route path="/addSPE1" element={<AddSPE1 />} />
          <Route path="/addSPE2" element={<AddSPE2 />} />
          <Route path="/group"> 
            <Route path=":groupId" element={<Group userInfo={userInfo} groupName={unitGroupName} groupNum={unitGroupNum} />} />
          </Route>         
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" reverse={false} />
    </div>
  );
}

export default Content;
