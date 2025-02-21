import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import store from "./state/store";
import { openLoading, closeLoading } from "./state/loadingSlice";

const isLoading = () => store.getState().loading.value;

const setIsLoading = (loading) => {
  store.dispatch(loading ? openLoading() : closeLoading());
};

const find = async (collectionName, uid, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false)
    return await getDoc(doc(db, collectionName, uid));

  try {
    store.dispatch(openLoading());
    return await getDoc(doc(db, collectionName, uid));
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const all = async (collectionName, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false)
    return await getDocs(collection(db, collectionName));

  try {
    store.dispatch(openLoading());
    return await getDocs(collection(db, collectionName));
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const get = async (collectionName, autoSetLoading, ...whereCond) => {
  if (autoSetLoading !== null && autoSetLoading === false)
    return await getDocs(query(collection(db, collectionName), ...whereCond));

  try {
    store.dispatch(openLoading());
    return await getDocs(query(collection(db, collectionName), ...whereCond));
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const set = async (collectionName, uid, data, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false)
    return await setDoc(doc(db, collectionName, uid), data, { merge: true });

  try {
    store.dispatch(openLoading());
    return await setDoc(doc(db, collectionName, uid), data, { merge: true });
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const add = async (collectionName, data, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false)
    return await addDoc(collection(db, collectionName), data);

  try {
    store.dispatch(openLoading());
    return await addDoc(collection(db, collectionName), data);
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const update = async (collectionName, uid, data, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false) {
    await updateDoc(doc(db, collectionName, uid), data);
    return;
  }

  try {
    store.dispatch(openLoading());
    await updateDoc(doc(db, collectionName, uid), data);
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

const remove = async (collectionName, uid, autoSetLoading) => {
  if (autoSetLoading !== undefined && autoSetLoading === false) {
    await deleteDoc(doc(db, collectionName, uid));
    return;
  }

  try {
    store.dispatch(openLoading());
    await deleteDoc(doc(db, collectionName, uid));
  } catch (e) {
    throw e;
  } finally {
    store.dispatch(closeLoading());
  }
};

export {
  isLoading,
  setIsLoading,
  get,
  all,
  find,
  add,
  set,
  update,
  remove,
  where,
  serverTimestamp,
};
