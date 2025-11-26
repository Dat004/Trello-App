import { DefaultLayout, BoardLayout } from "@/Layouts";
import paths from "./paths";
import pages from "@/Pages";

const routes = [
  {
    id: 1,
    name: "Trang chủ",
    path: paths.home,
    page: pages.Home,
    layout: DefaultLayout,
  },
  {
    id: 2,
    name: "Không gian làm việc",
    path: paths.workspaces,
    page: pages.Workspaces,
    layout: DefaultLayout,
  },
  {
    id: 3,
    name: "Mẫu",
    path: paths.templates,
    page: pages.Templates,
    layout: DefaultLayout,
  },
  {
    id: 4,
    name: "Thành viên",
    path: paths.members,
    page: pages.Members,
    layout: DefaultLayout,
  },
  {
    id: 5,
    name: "Cài đặt",
    path: paths.settings,
    page: pages.Settings,
    layout: DefaultLayout,
  },
  {
    id: 6,
    name: "Chi tiết bảng",
    path: paths.board,
    page: pages.Board,
    layout: BoardLayout,
  },
  {
    id: 7,
    name: "Đăng nhập",
    path: paths.login,
    page: pages.Login,
    layout: null,
  },
  {
    id: 8,
    name: "Đăng ký",
    path: paths.register,
    page: pages.Register,
    layout: null,
  },
];

export default routes;
