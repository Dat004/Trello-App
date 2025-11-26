import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, provider } from "@/config/firebase";
import { insertRTDB, timestampRTDB } from "./rtdb";

export const logout = async () => {
  const currentUser = auth.currentUser; // Lấy người dùng hiện tại TRƯỚC KHI đăng xuất

  try {
    if (currentUser) {
      const uid = currentUser.uid;
      const userPresencePath = `users/presence_status/${uid}`;

      // Cập nhật trạng thái offline TRƯỚC KHI đăng xuất
      await insertRTDB(userPresencePath, {
        is_online: false,
        last_active: timestampRTDB(),
      });

      // Sau khi cập nhật trạng thái, tiến hành đăng xuất
      await signOut(auth);
    } else {
      // Nếu không có người dùng nào đang đăng nhập, chỉ cần gọi signOut
      await signOut(auth);
    }

    return {
      success: true,
      message: "Đăng xuất thành công",
    };
  } catch (err) {
    console.error("Lỗi khi đăng xuất:", err);
    return {
      success: false,
      error: err,
      message: "Đã có lỗi xảy ra trong quá trình đăng xuất.",
    };
  }
};

export const registerWithEmail = async (data) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    return {
      success: true,
      message: "Đăng ký thành công",
      data: { ...userCredential.user },
    };
  } catch (err) {
    return {
      success: false,
      error: err,
      message: handleFirebaseError(err.code),
    };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const data = userCredential.user;
    const user = {
      uid: data.uid,
      ...data.providerData[0],
    };

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
      message: handleFirebaseError(err.code),
    };
  }
};

export const logInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const data = userCredential.user;
    const user = {
      uid: data.uid,
      ...data.providerData[0],
    };

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
      message: handleFirebaseError(err.code),
    };
  }
};

const handleFirebaseError = (errorCode) => {
  const errorMessages = {
    // Đăng ký
    "auth/email-already-in-use":
      "Email này đã được sử dụng bởi tài khoản khác.",
    "auth/weak-password": "Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.",
    "auth/invalid-email": "Địa chỉ email không hợp lệ.",
    "auth/operation-not-allowed": "Đăng ký bằng email/mật khẩu hiện bị tắt.",

    // Đăng nhập
    "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
    "auth/wrong-password": "Mật khẩu không chính xác.",
    "auth/user-disabled": "Tài khoản này đã bị vô hiệu hóa.",
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng.", // Firebase v9+ hay trả cái này

    // Popup Google
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập Google.",
    "auth/popup-blocked":
      "Trình duyệt đã chặn popup. Vui lòng cho phép popup và thử lại.",
    "auth/cancelled-popup-request":
      "Yêu cầu đăng nhập bị hủy (nhiều popup cùng lúc).",
    "auth/account-exists-with-different-credential":
      "Tài khoản này đã tồn tại với phương thức đăng nhập khác. Vui lòng dùng phương thức cũ.",

    // Quá nhiều request
    "auth/too-many-requests":
      "Quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau vài phút.",

    // Mạng / hệ thống
    "auth/network-request-failed":
      "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.",
    "auth/internal-error": "Lỗi hệ thống. Vui lòng thử lại sau.",

    // Các lỗi khác
    "auth/requires-recent-login":
      "Yêu cầu đăng nhập lại để thực hiện hành động này.",
    "auth/invalid-action-code": "Mã xác nhận không hợp lệ hoặc đã hết hạn.",
  };

  const friendlyMessage =
    errorMessages[errorCode] || "Đã có lỗi xảy ra. Vui lòng thử lại sau.";

  // Trả về chuỗi (không cần new Error nữa, vì component dễ hiển thị hơn)
  return friendlyMessage;
};
