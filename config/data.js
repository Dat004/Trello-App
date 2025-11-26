import { Sun, Moon, Monitor } from "lucide-react";
import paths from "./paths";

export const boardColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export const listColors = [
  { name: "Xanh lá", value: "emerald", class: "bg-emerald-500" },
  { name: "Xanh dương", value: "blue", class: "bg-blue-500" },
  { name: "Tím", value: "purple", class: "bg-purple-500" },
  { name: "Hồng", value: "pink", class: "bg-pink-500" },
  { name: "Cam", value: "orange", class: "bg-orange-500" },
  { name: "Đỏ", value: "red", class: "bg-red-500" },
  { name: "Vàng", value: "yellow", class: "bg-yellow-500" },
  { name: "Xám", value: "gray", class: "bg-gray-500" },
];

export const headerMenuData = [
  {
    id: 1,
    name: "Không gian làm việc",
    path: paths.workspaces,
  },
  {
    id: 2,
    name: "Mẫu",
    path: paths.templates,
  },
  {
    id: 3,
    name: "Thành viên",
    path: paths.members,
  },
];

// Initial state
export const initialBoards = [
  {
    id: "1",
    name: "Dự án Website",
    description: "Phát triển website công ty",
    color: "bg-blue-500",
    starred: true,
    members: 5,
    lastActivity: "2 giờ trước",
    lists: [
      {
        id: "list-1",
        title: "Cần làm",
        boardId: "1",
        order: 0,
        color: "blue",
        cards: [
          {
            id: "card-1",
            title: "Thiết kế giao diện trang chủ",
            description: "Tạo mockup và wireframe cho trang chủ",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            priority: "high",
            labels: [
              { id: "label-1", name: "Design", color: "purple" },
              { id: "label-2", name: "UI/UX", color: "pink" },
            ],
            checklist: [
              {
                id: "check-1",
                text: "Nghiên cứu đối thủ",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-2",
                text: "Tạo wireframe",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-3",
                text: "Thiết kế mockup",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-4",
                text: "Review với team",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-1",
                name: "Nguyễn Văn A",
                avatar: "/diverse-avatars.png",
              },
              {
                id: "member-2",
                name: "Trần Thị B",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [
              {
                id: "comment-1",
                text: "Đã hoàn thành phần nghiên cứu, sẽ bắt đầu wireframe",
                author: "Nguyễn Văn A",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              },
            ],
            attachments: [],
          },
          {
            id: "card-2",
            title: "Viết API backend",
            description: "Xây dựng REST API cho hệ thống",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            priority: "medium",
            labels: [{ id: "label-3", name: "Backend", color: "green" }],
            checklist: [
              {
                id: "check-5",
                text: "Thiết kế database schema",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-6",
                text: "Viết API endpoints",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-7",
                text: "Viết unit tests",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-2",
        title: "Đang làm",
        boardId: "1",
        order: 1,
        color: "orange",
        cards: [
          {
            id: "card-3",
            title: "Tích hợp thanh toán",
            description: "Kết nối với cổng thanh toán",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: "high",
            labels: [
              { id: "label-4", name: "Payment", color: "yellow" },
              { id: "label-5", name: "Integration", color: "blue" },
            ],
            checklist: [
              {
                id: "check-8",
                text: "Đăng ký tài khoản Stripe",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-9",
                text: "Tích hợp SDK",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-10",
                text: "Test thanh toán",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-1",
                name: "Nguyễn Văn A",
                avatar: "/diverse-avatars.png",
              },
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [
              {
                id: "comment-2",
                text: "Đã tích hợp xong SDK, đang test",
                author: "Lê Văn C",
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              },
            ],
            attachments: [
              {
                id: "attach-1",
                name: "stripe-integration-guide.pdf",
                url: "#",
                type: "application/pdf",
                size: 1024000,
                createdAt: new Date(),
              },
            ],
          },
        ],
      },
      {
        id: "list-3",
        title: "Hoàn thành",
        boardId: "1",
        order: 2,
        color: "emerald",
        cards: [
          {
            id: "card-4",
            title: "Setup dự án",
            description: "Khởi tạo repository và cấu hình môi trường",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: "low",
            labels: [{ id: "label-6", name: "Setup", color: "gray" }],
            checklist: [
              {
                id: "check-11",
                text: "Tạo repository",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-12",
                text: "Cấu hình CI/CD",
                completed: true,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
          {
            id: "card-5",
            title: "Thiết lập database",
            description: "Tạo schema và migration",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: "medium",
            labels: [{ id: "label-7", name: "Database", color: "indigo" }],
            checklist: [
              {
                id: "check-13",
                text: "Thiết kế schema",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-14",
                text: "Chạy migration",
                completed: true,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-4",
        title: "Kết thúc",
        boardId: "1",
        order: 3,
        color: "gray",
        cards: [],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Marketing Q4",
    description: "Chiến lược marketing quý 4",
    color: "bg-green-500",
    starred: false,
    members: 3,
    lastActivity: "1 ngày trước",
    lists: [
      {
        id: "list-4",
        title: "Ý tưởng",
        boardId: "2",
        order: 0,
        color: "purple",
        cards: [
          {
            id: "card-6",
            title: "Chiến dịch social media",
            description: "Lên kế hoạch cho các nền tảng mạng xã hội",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            priority: "medium",
            labels: [{ id: "label-8", name: "Marketing", color: "red" }],
            checklist: [],
            members: [
              {
                id: "member-2",
                name: "Trần Thị B",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-5",
        title: "Đang thực hiện",
        boardId: "2",
        order: 1,
        color: "yellow",
        cards: [],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Phát triển App",
    description: "Ứng dụng mobile mới",
    color: "bg-purple-500",
    starred: true,
    members: 8,
    lastActivity: "3 giờ trước",
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Thiết kế UI/UX",
    description: "Cải thiện trải nghiệm người dùng",
    color: "bg-orange-500",
    starred: false,
    members: 4,
    lastActivity: "5 giờ trước",
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const settingsData = {
  notifications: [
    {
      title: "Khi ai đó nhắc đến bạn",
      label: "Được nhắc đến",
      type: "checkbox",
      key: "mentions",
    },
    {
      title: "Khi được giao thẻ mới",
      label: "Được giao thẻ",
      type: "checkbox",
      key: "card_assignments",
    },
    {
      title: "Bình luận mới trên thẻ của bạn",
      label: "Bình luận",
      type: "checkbox",
      key: "comments",
    },
    {
      title: "Nhắc nhở về thẻ sắp hết hạn",
      label: "Hạn chót",
      type: "checkbox",
      key: "due_reminders",
    },
    {
      title: "Thay đổi trong bảng bạn theo dõi",
      label: "Cập nhật bảng",
      type: "checkbox",
      key: "board_updates",
    },
  ],
  appearance: [
    {
      label: "Chủ đề",
      type: "select",
      key: "theme",
      items: [
        {
          value: "light",
          text_value: "Sáng",
        },
        {
          value: "dark",
          text_value: "Tối",
        },
        {
          value: "system",
          text_value: "Theo hệ thống",
        },
      ],
    },
    {
      label: "Ngôn ngữ",
      type: "select",
      key: "language",
      items: [
        {
          value: "vi",
          text_value: "Tiếng Việt",
        },
      ],
    },
    {
      label: "Múi giờ",
      type: "select",
      key: "timezone",
      items: [
        {
          value: "Asia/Ho_Chi_Minh",
          text_value: "Việt Nam (GMT+7)",
        },
      ],
    },
    {
      label: "Định dạng ngày",
      type: "select",
      key: "date_format",
      items: [
        {
          value: "DD/MM/YYYY",
          text_value: "DD/MM/YYYY",
        },
      ],
    },
  ],
  privacy: [
    {
      label: "Hiển thị hồ sơ",
      type: "select",
      key: "profile_visibility",
      items: [
        {
          value: "public",
          text_value: "Công khai",
        },
        {
          value: "members",
          text_value: "Thành viên",
        },
        {
          value: "private",
          text_value: "Riêng tư",
        },
      ],
    },
    {
      label: "Hiển thị hoạt động",
      type: "select",
      key: "activity_visibility",
      items: [
        {
          value: "public",
          text_value: "Công khai",
        },
        {
          value: "members",
          text_value: "Thành viên",
        },
        {
          value: "private",
          text_value: "Riêng tư",
        },
      ],
    },
    {
      label: "Bảng mặc định",
      type: "select",
      key: "default_board",
      items: [
        {
          value: "public",
          text_value: "Công khai",
        },
        {
          value: "members",
          text_value: "Thành viên",
        },
        {
          value: "private",
          text_value: "Riêng tư",
        },
      ],
    },
  ],
};
