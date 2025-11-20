import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../config/firebase";

// Helper
const collectionRef = (collectionId) => collection(db, collectionId);
const docRef = (collectionId, id) => doc(db, collectionId, id);

export const create = async (collectionId, data) => {
  try {
    const docRef = await addDoc(collectionRef(collectionId), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

export const insert = async (collectionId, id, data) => {
  try {
    await setDoc(docRef(collectionId, id), data);
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

export const update = async (collectionId, id, data) => {
  try {
    await updateDoc(docRef(collectionId, id), data);
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

export const remove = async (collectionId, id) => {
  try {
    await deleteDoc(docRef(collectionId, id));
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};
