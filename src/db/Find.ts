import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../firebase";
import store from "../state/store";
import { closeLoading, openLoading } from "../state/loadingSlice";

export const useFind = ({ path, uid, fetchOnFocus = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const refetch = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const snap = await getDoc(doc(db, path, id));
      setData({
        id: snap.id,
        ...snap.data(),
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchOnFocus) {
    useFocusEffect(
      useCallback(() => {
        refetch(uid);
      }, [])
    );
  }

  return { isLoading, error, data, refetch };
};

export const findG = async (path, uid) => {
  try {
    store.dispatch(openLoading());
    return await getDoc(doc(db, path, uid));
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

export const find = (path, uid) => getDoc(doc(db, path, uid));
