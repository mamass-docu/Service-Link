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
} from "firebase/firestore";
import { db } from "./firebase";

const find = async (collectionName, uid, format) => {
  const snapshot = await getDoc(doc(db, collectionName, uid));
  return format == undefined ? snapshot : format(snapshot);
};

const all = async (collectionName, format) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return format == undefined ? snapshot : format(snapshot.docs);
};

const get = async (collectionName, ...whereCond) => {
  return await getDocs(query(collection(db, collectionName), ...whereCond));
};

const add = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), data);
};

const update = async (collectionName, uid, data) => {
  await updateDoc(doc(db, collectionName, uid), data);
};

const remove = async (collectionName, uid) => {
  await deleteDoc(doc(db, collectionName, uid));
};

export { get, all, find, add, update, remove, where, serverTimestamp };
