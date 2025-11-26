import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onDisconnect } from "firebase/database";

import {
  getOneFS,
  insertFS,
  timestampFS,
  listenDocument,
} from "@/lib/firestore";
import { insertRTDB, listenRTDB, timestampRTDB, dbRef } from "@/lib/rtdb";
import AuthContext from "@/context/AuthContext";
import { auth } from "../../config/firebase";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  const defaultSettings = {
    notifications: {
      email: true, // Thông báo qua email
      push: true, // Thông báo đẩy
      mentions: true, // Thông báo khi được nhắc đến
      card_assignments: true, // Thông báo khi được giao thẻ
      comments: false, // Thông báo bình luận
      due_reminders: true, // Nhắc nhở hạn chót
      board_updates: false, // Cập nhật bảng
    },
    appearance: {
      theme: "system", // Giao diện: light, dark, system
      language: "vi", // Ngôn ngữ
      timezone: "Asia/Ho_Chi_Minh", // Múi giờ
      date_format: "DD/MM/YYYY", // Định dạng ngày
    },
    privacy: {
      profile_visibility: "members", // Hiển thị hồ sơ: private, members, public
      activity_visibility: "members", // Hiển thị hoạt động: private, members, public
      default_board: "private", // Bảng mặc định: private, members, public
    },
    account: {
      two_factor_enabled: false, // Xác thực hai yếu tố
      linked_devices: [], // Thiết bị đã liên kết
    },
  };

  // Tham chiếu đến node chứa trạng thái: is_online, last_active của người dùng trong RTDB
  const getUserPresenceRef = (uid) => {
    if (!uid) return null;
    return dbRef(`users/presence_status/${uid}`);
  };

  // Thiết lập trạng thái: is_online, last_active trong Realtime Database
  const setupRtdbPresence = async (uid) => {
    if (!uid) return;

    const userPresencePath = `users/presence_status/${uid}`;
    const userPresenceRef = getUserPresenceRef(uid);

    if (!userPresenceRef) return;

    // Khi kết nối bị ngắt, tự động cập nhật trạng thái
    onDisconnect(userPresenceRef).set({
      is_online: false,
      last_active: timestampRTDB(), // Ghi lại thời điểm ngắt kết nối
    });

    // Ghi trạng thái online và thời gian hoạt động cuối cùng khi người dùng kết nối
    await insertRTDB(userPresencePath, {
      is_online: true,
      last_active: timestampRTDB(),
    });
  };

  // Tạo hoặc cập nhật hồ sơ người dùng trong Firestore
  const createOrUpdateUserProfile = async (firebaseUser) => {
    if (!firebaseUser) return;

    const providerInfo = firebaseUser.providerData[0] || {};
    const data = await getOneFS("users", firebaseUser.uid);

    // Kiểm tra user đã tồn tại chưa
    if (data?.success) {
      if (!data.data) {
        const userData = {
          // Thông tin cơ bản
          bio: "",
          uid: firebaseUser.uid,
          providerData: providerInfo,
          email: firebaseUser.email || providerInfo.email,
          photoURL: firebaseUser.photoURL || providerInfo.photoURL || null,
          displayName: firebaseUser.displayName || providerInfo.displayName,
          provider: providerInfo.providerId || "password",
          created_at: timestampFS(),
          updated_at: timestampFS(),

          // Settings mặc định
          settings: defaultSettings,
        };

        // Tạo mới lần đầu đăng nhập (tạo với UID)
        await insertFS("users", firebaseUser.uid, userData);
      }
    }
  };

  useEffect(() => {
    let unsubscribeUserSnapshot = null;

    // Lắng nghe thay đổi trạng thái xác thực
    const unsubscribeAuthState = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (unsubscribeUserSnapshot) {
          unsubscribeUserSnapshot();
          unsubscribeUserSnapshot = null;
        }

        if (firebaseUser) {
          setIsLogged(true);
          // Tạo/cập nhật profile trong Firestore
          await createOrUpdateUserProfile(firebaseUser);

          // Thiết lập trạng thái hiện diện trong Realtime Database khi đăng nhập thành công
          await setupRtdbPresence(firebaseUser.uid);

          // Lắng nghe realtime updates từ Firestore cho user profile
          unsubscribeUserSnapshot = listenDocument(
            "users",
            firebaseUser.uid,
            (user) => {
              setUser(user);
              setLoading(false);
            }
          );
        } else {
          // Người dùng đã đăng xuất
          setUser(null);
          setLoading(false);
          setIsLogged(false);
        }
      }
    );

    // Lắng nghe thay đổi trạng thái kết nối
    const unsubscribeConnectSnapshot = listenRTDB(
      ".info/connected",
      async (snapshot) => {
        // snapshot.data chứa giá trị boolean từ .info/connected
        const isConnected = snapshot.data;
        const uid = auth.currentUser?.uid; // Lấy UID của người dùng hiện tại

        if (uid) {
          if (isConnected) {
            console.log(
              "Ứng dụng đã kết nối lại với Firebase Realtime Database."
            );
            // Xử lý mất kết nối tạm thời (ví dụ: tắt/bật Wi-Fi).
            await setupRtdbPresence(uid);
          } else {
            console.log(
              "Ứng dụng đã mất kết nối với Firebase Realtime Database."
            );
          }
        }
      }
    );

    return () => {
      // Hủy đăng ký lắng nghe khi unmount
      unsubscribeAuthState();
      unsubscribeConnectSnapshot();

      // Hủy lắng nghe Firestore
      if (unsubscribeUserSnapshot) {
        unsubscribeUserSnapshot();
      }
    };
  }, []);

  const value = {
    user, // Bao gồm thông tin cơ bản, settings của người dúng
    loading, // Trạng thái đang tải, tránh flash ui khi xác định auth
    isLogged, // Trạng thái đã đăng nhập hay chưa
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Chỉ render khi không còn khởi tạo */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
