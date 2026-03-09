export const BACKGROUND_COLORS = [
  { name: "Xanh lá", value: "emerald", class: "bg-green-500" },
  { name: "Xanh dương", value: "blue", class: "bg-blue-500" },
  { name: "Xanh ngọc", value: "teal", class: "bg-teal-500" },
  { name: "Chàm", value: "indigo", class: "bg-indigo-500" },
  { name: "Tím", value: "purple", class: "bg-purple-500" },
  { name: "Hồng", value: "pink", class: "bg-pink-500" },
  { name: "Cam", value: "orange", class: "bg-orange-500" },
  { name: "Đỏ", value: "red", class: "bg-red-500" },
  { name: "Xám", value: "gray", class: "bg-gray-500" },
];

export const GRADIENT_MAP = {
  "bg-blue-500": "from-blue-600 to-indigo-700",
  "bg-green-500": "from-emerald-500 to-teal-600",
  "bg-orange-500": "from-orange-500 to-rose-500",
  "bg-red-500": "from-red-600 to-pink-700",
  "bg-purple-500": "from-purple-600 to-fuchsia-700",
  "bg-pink-500": "from-pink-500 to-rose-600",
  "bg-slate-500": "from-slate-600 to-slate-800",
};

export const LIGHT_THEMES = [
  { 
    id: "default-light",
    name: "Mặc định", 
    value: "bg-slate-50 text-slate-900",
    preview: "bg-slate-50"
  },
  { 
    id: "sky-light",
    name: "Bầu trời", 
    value: "bg-sky-100/50 text-sky-900",
    preview: "bg-sky-200"
  },
  { 
    id: "rose-light",
    name: "Hoa hồng", 
    value: "bg-rose-100/50 text-rose-900",
    preview: "bg-rose-200"
  },
  { 
    id: "amber-light",
    name: "Hổ phách", 
    value: "bg-amber-100/50 text-amber-900",
    preview: "bg-amber-200"
  },
  { 
    id: "emerald-light",
    name: "Ngọc lục bảo", 
    value: "bg-emerald-100/50 text-emerald-900",
    preview: "bg-emerald-200"
  },
  { 
    id: "indigo-light",
    name: "Tràm", 
    value: "bg-indigo-100/50 text-indigo-900",
    preview: "bg-indigo-200"
  },
];

export const DARK_THEMES = [
  { 
    id: "default-dark",
    name: "Mặc định", 
    value: "bg-slate-950 text-slate-100",
    preview: "bg-slate-900"
  },
  { 
    id: "midnight-dark",
    name: "Nửa đêm", 
    value: "bg-blue-950/80 text-blue-100",
    preview: "bg-blue-950"
  },
  { 
    id: "forest-dark",
    name: "Rừng sâu", 
    value: "bg-green-950/80 text-green-100",
    preview: "bg-green-950"
  },
  { 
    id: "volcano-dark",
    name: "Núi lửa", 
    value: "bg-red-950/80 text-red-100",
    preview: "bg-red-950"
  },
  { 
    id: "space-dark",
    name: "Không gian", 
    value: "bg-zinc-950 text-zinc-100",
    preview: "bg-zinc-900"
  },
  { 
    id: "nebula-dark",
    name: "Tinh vân", 
    value: "bg-purple-950/80 text-purple-100",
    preview: "bg-purple-950"
  },
];

export const GRADIENT_THEMES = [
  { 
    name: "Sunset", 
    value: "bg-gradient-to-br from-orange-500/20 to-rose-500/20",
    preview: "bg-gradient-to-br from-orange-400 to-rose-400"
  },
  { 
    name: "Ocean", 
    value: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    preview: "bg-gradient-to-br from-blue-400 to-cyan-400"
  },
  { 
    name: "Aurora", 
    value: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    preview: "bg-gradient-to-br from-green-400 to-emerald-400"
  },
  { 
    name: "Mystic", 
    value: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
    preview: "bg-gradient-to-br from-purple-400 to-indigo-400"
  },
];
