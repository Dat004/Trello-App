import paths from "./paths";
import pages from "@/Pages";

const routes = [
  {
    id: 1,
    name: "Trang chủ",
    path: paths.home,
    page: pages.Home,
  },
  {
    id: 2,
    name: "Không gian làm việc",
    path: paths.workspaces,
    page: pages.Workspaces,
  },
  {
    id: 3,
    name: "Mẫu",
    path: paths.templates,
    page: pages.Templates,
  },
  {
    id: 4,
    name: "Thành viên",
    path: paths.members,
    page: pages.Members,
  },
  {
    id: 5,
    name: "Cài đặt",
    path: paths.settings,
    page: pages.Settings,
  },
  {
    id: 6,
    name: "Chi tiết bảng",
    path: paths.board,
    page: pages.Board,
  },
  {
    id: 7,
    name: "Đăng nhập",
    path: paths.login,
    page: pages.Login,
  },
  {
    id: 8,
    name: "Đăng ký",
    path: paths.register,
    page: pages.Register,
  },
];

export default routes;
