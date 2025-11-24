import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../config/firebase";

// Helper
export const collectionRef = (collectionId) => collection(db, collectionId);
export const docRef = (collectionId, id) => doc(db, collectionId, id);
export const timestampFS = serverTimestamp;

// Tạo một tài liệu mới trong Firestore với dữ liệu được cung cấp
export const createFS = async (collectionId, data) => {
  try {
    const results = await addDoc(collectionRef(collectionId), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return { success: true, id: results.id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

// Chèn hoặc ghi đè dữ liệu tại tài liệu Firestore cụ thể
export const insertFS = async (collectionId, id, data, options) => {
  try {
    await setDoc(
      docRef(collectionId, id),
      {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      options
    );
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

// Cập nhật dữ liệu tại tài liệu Firestore cụ thể
export const updateFS = async (collectionId, id, data) => {
  try {
    await updateDoc(docRef(collectionId, id), {
      ...data,
      updated_at: serverTimestamp(),
    });
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

// Xóa tài liệu Firestore cụ thể
export const removeFS = async (collectionId, id) => {
  try {
    await deleteDoc(docRef(collectionId, id));
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

// Lấy một tài liệu Firestore cụ thể
export const getOneFS = async (collectionId, id) => {
  try {
    const snap = await getDoc(docRef(collectionId, id));
    return {
      success: true,
      data: snap.exists() ? { ...snap.data() } : null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lắng nghe các thay đổi trong một tập hợp Firestore với các ràng buộc tùy chọn
export const listenCollection = (collectionId, callback, constraints = []) => {
  let q = collectionRef(collectionId);

  constraints.forEach((constraint) => {
    q = constraint(q);
  });
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(results);
    },
    (error) => {
      console.error("listenCollection error:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

// Lắng nghe các thay đổi trong một tài liệu Firestore cụ thể
export const listenDocument = (collectionId, id, callback) => {
  if (!id) {
    callback(null);

    return () => {};
  }

  const documentRef = docRef(collectionId, id);
  const unsubscribe = onSnapshot(
    documentRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("listenDocument error:", error);
      callback(null);
    }
  );

  return unsubscribe;
};
