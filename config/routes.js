import { DefaultLayout, BoardLayout } from "@/Layouts";
import paths from "./paths";
import pages from "@/Pages";

const routes = [
  {
    id: 1,
    name: "home",
    path: paths.home,
    page: pages.Home,
    layout: DefaultLayout,
  },
  {
    id: 1,
    name: "home",
    path: paths.board,
    page: pages.Board,
    layout: BoardLayout,
  },
];

export default routes;
