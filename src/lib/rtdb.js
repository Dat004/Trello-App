import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  serverTimestamp,
} from "firebase/database";

import { rtdb } from "../../config/firebase";

export const dbRef = (path) => ref(rtdb, path);
export const timestampRTDB = serverTimestamp;

// Tạo một bản ghi mới trong RTDB với dữ liệu được cung cấp
export const createRTDB = async (path, data) => {
  try {
    const newRef = push(dbRef(path));
    await set(newRef, {
      ...data,
    });
    return { success: true, id: newRef.key };
  } catch (error) {
    console.error("RTDB create error:", error);
    return { success: false, error: error.message };
  }
};

// Chèn hoặc ghi đè dữ liệu tại đường dẫn RTDB cụ thể
export const insertRTDB = async (path, data) => {
  try {
    await set(dbRef(path), {
      ...data,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cập nhật dữ liệu tại đường dẫn RTDB cụ thể
export const updateRTDB = async (path, data) => {
  try {
    await update(dbRef(path), {
      ...data,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Xóa dữ liệu tại đường dẫn RTDB cụ thể
export const removeRTDB = async (path) => {
  try {
    await remove(dbRef(path));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lấy một bản ghi từ RTDB tại đường dẫn cụ thể
export const getOneRTDB = async (path) => {
  try {
    const snapshot = await get(dbRef(path));
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lắng nghe thay đổi dữ liệu tại đường dẫn RTDB cụ thể
export const listenRTDB = (path, callback) => {
  const ref = dbRef(path);
  const unsubscribe = onValue(
    ref,
    (snapshot) => {
      callback({ data: snapshot.val(), key: snapshot.key });
    },
    (error) => {
      console.error("RTDB listen error:", error);
    }
  );

  return unsubscribe;
};
