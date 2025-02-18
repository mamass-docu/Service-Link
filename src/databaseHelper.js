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
import { db, app } from "./firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const find = async (collectionName, uuid) => {
  return await getDoc(doc(db, collectionName, uuid));
};

const all = async (collectionName) => {
  return await getDocs(collection(db, collectionName));
};

const get = async (collectionName, ...whereCond) => {
  return await getDocs(query(collection(db, collectionName), ...whereCond));
};

const add = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), data);
};

const update = async (collectionName, uuid, data) => {
  await updateDoc(doc(db, collectionName, uuid), data);
};

const remove = async (collectionName, uuid) => {
  await deleteDoc(doc(db, collectionName, uuid));
};

const uploadFile = async (filePath, fileUri) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, filePath);
  const response = await fetch(fileUri);
  const blob = await response.blob();

  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

export {
  get,
  all,
  find,
  add,
  update,
  remove,
  where,
  uploadFile,
  serverTimestamp,
};
