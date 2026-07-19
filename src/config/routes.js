import { DefaultLayout, BoardLayout } from "@/Layouts";
import { lazy } from "react";
import paths from "./paths";

const Home = lazy(() => import("@/Pages/Home"));
const Workspaces = lazy(() => import("@/Pages/Workspaces"));
const Workspace = lazy(() => import("@/Pages/Workspace"));
const Boards = lazy(() => import("@/Pages/Boards"));
const Board = lazy(() => import("@/Pages/Board"));
const Templates = lazy(() => import("@/Pages/Templates"));
const Members = lazy(() => import("@/Pages/Members"));
const Settings = lazy(() => import("@/Pages/Settings"));
const Notifications = lazy(() => import("@/Pages/Notifications"));
const Login = lazy(() => import("@/Pages/Login"));
const Register = lazy(() => import("@/Pages/Register"));

const routes = [
  {
    id: 1,
    name: "Trang chủ",
    path: paths.home,
    page: Home,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 2,
    name: "Không gian làm việc",
    path: paths.workspaces,
    page: Workspaces,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 3,
    name: "Bảng làm việc",
    path: paths.boards,
    page: Boards,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 4,
    name: "Mẫu",
    path: paths.templates,
    page: Templates,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 5,
    name: "Thành viên",
    path: paths.members,
    page: Members,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 6,
    name: "Cài đặt",
    path: paths.settings,
    page: Settings,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 7,
    name: "Chi tiết bảng",
    path: paths.board,
    page: Board,
    layout: BoardLayout,
    auth: "protected",
  },
  {
    id: 8,
    name: "Chi tiết không gian làm việc",
    path: paths.workspace,
    page: Workspace,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 9,
    name: "Thông báo",
    path: paths.notifications,
    page: Notifications,
    layout: DefaultLayout,
    auth: "protected",
  },
  {
    id: 10,
    name: "Đăng nhập",
    path: paths.login,
    page: Login,
    layout: null,
    auth: "guest",
  },
  {
    id: 11,
    name: "Đăng ký",
    path: paths.register,
    page: Register,
    layout: null,
    auth: "guest",
  },
];

export default routes;
