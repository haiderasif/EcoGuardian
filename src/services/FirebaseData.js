import { createContext, useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";

export const FirebaseContext = createContext();

export const FirebaseContextProvider = ({ children }) => {
  const [mapData, setMapData] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [treesPlanted, setTreesPlanted] = useState(0); // State to store TreesPlanted value
  const user = getAuth().currentUser;
  const [userid, setUserID] = useState(null);

  const GetListingData = () => {
    const db = getDatabase();
    const reference = ref(db, "listing");
    onValue(reference, (snapshot) => {
      var finished = [];
      snapshot.forEach((data) => {
        let result = data.val();
        result["key"] = data.key;
        if (finished.length == 0) {
          finished.push(result);
        } else {
          finished.unshift(result);
        }
      });
      setListingData(finished);
    });
  };

  const GetMapData = () => {
    const db = getDatabase();
    const reference = ref(db, "data");
    const auth = getAuth();
    const currentUser = auth.currentUser;

    onValue(reference, (snapshot) => {
      var finished = [];
      snapshot.forEach((data) => {
        let result = data.val();
        result["key"] = data.key;

        // Check the category and userId fields
        if (
          result.Category === "Public" ||
          (result.Category === "Private" && result.UserID === currentUser.uid)
        ) {
          finished.push(result);
        }
      });
      setMapData(finished);
    });
  };

  const GetTreesPlanted = () => {
    const db = getDatabase();
    const userRef = ref(db, "User");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((data) => {
        let result = data.val();
        result["key"] = data.key;
        if (result.UserId == user.uid) {
          setUserID(result);
          setTreesPlanted(result.TreesPlanted);
        }
      });
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        GetTreesPlanted,
        GetMapData,
        GetListingData,
        treesPlanted,
        listingData,
        mapData,
        userid,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
