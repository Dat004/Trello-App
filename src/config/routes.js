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
    auth: "protected",
  },
  {
    id: 2,
    name: "Không gian làm việc",
    path: paths.workspaces,
    page: pages.Workspaces,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 3,
    name: "Bảng làm việc",
    path: paths.boards,
    page: pages.Boards,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 4,
    name: "Mẫu",
    path: paths.templates,
    page: pages.Templates,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 5,
    name: "Thành viên",
    path: paths.members,
    page: pages.Members,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 6,
    name: "Cài đặt",
    path: paths.settings,
    page: pages.Settings,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 7,
    name: "Chi tiết bảng",
    path: paths.board,
    page: pages.Board,
    layout: BoardLayout,
    auth: "protected",
  },
  {
    id: 8,
    name: "Chi tiết không gian làm việc",
    path: paths.workspace,
    page: pages.Workspace,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 9,
    name: "Đăng nhập",
    path: paths.login,
    page: pages.Login,
    layout: null,
    auth: "guest",
  },
  {
    id: 10,
    name: "Đăng ký",
    path: paths.register,
    page: pages.Register,
    layout: null,
    auth: "guest",
  },
];

export default routes;
