import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

import AuthContext from "@/context/AuthContext";
import { auth } from "../../config/firebase";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  const createOrUpdateUserProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    // const userSnap = await getDoc(userRef);

    // if (!userSnap.exists()) {
    //   // Người dùng đăng nhập lần đầu → tạo profile
    // } else {
    //   // Cập nhật lần đăng nhập cuối
    // }
  };

  useEffect(() => {
    const authStateChange = async (user) => {
      if (user) {
        // Lưu thông tin user vào state
        setUser(user?.providerData[0]);
        setIsLogged(true);

        // Tạo/cập nhật profile trong Firestore
        await createOrUpdateUserProfile(user);
      } else {
        // Chưa đăng nhập
        setUser(null);
        setIsLogged(false);
      }

      // Dừng loading sau khi xác định xong trạng thái
      setLoading(false);
    };
    const unsubscribe = onAuthStateChanged(auth, authStateChange);

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLogged,
    loading,
  };

  console.log(value);

  return (
    <AuthContext.Provider value={value}>
      {/* Chỉ render khi không còn khởi tạo */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
