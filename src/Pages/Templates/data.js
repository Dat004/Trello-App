import {
  Briefcase,
  Users,
  Code,
  Heart,
  Zap,
  Calendar,
  Target,
  BookOpen,
  Rocket,
  Coffee,
} from "lucide-react";

export const templateData = [
  {
    id: "1",
    name: "Kanban Project Management",
    description: "Quản lý dự án theo phương pháp Kanban với các cột cơ bản",
    category: "project-management",
    icon: Briefcase,
    color: "bg-blue-500",
    lists: [
      {
        id: 1,
        name: "Backlog",
        example_cards: [
          {
            id: 1,
            title: "Gather requirements",
            description: "Collect project specifications",
          },
          {
            id: 2,
            title: "Market research",
            description: "Analyze market trends",
          },
          {
            id: 3,
            title: "Stakeholder meeting",
            description: "Discuss project goals",
          },
        ],
      },
      {
        id: 2,
        name: "To Do",
        example_cards: [
          {
            id: 4,
            title: "Define project scope",
            description: "Outline project objectives and deliverables",
          },
          {
            id: 5,
            title: "Create wireframes",
            description: "Design initial UI mockups",
          },
          {
            id: 6,
            title: "Set up repository",
            description: "Initialize Git repository",
          },
        ],
      },
      {
        id: 3,
        name: "In Progress",
        example_cards: [
          {
            id: 7,
            title: "Develop main feature",
            description: "Code core functionality",
          },
          {
            id: 8,
            title: "Test user flow",
            description: "Validate user navigation",
          },
          {
            id: 9,
            title: "Optimize performance",
            description: "Improve load times",
          },
        ],
      },
      {
        id: 4,
        name: "Review",
        example_cards: [
          {
            id: 10,
            title: "Code review",
            description: "Check code quality and standards",
          },
          {
            id: 11,
            title: "UI review",
            description: "Ensure design consistency",
          },
          {
            id: 12,
            title: "Bug fixing",
            description: "Address reported issues",
          },
        ],
      },
      {
        id: 5,
        name: "Done",
        example_cards: [
          {
            id: 13,
            title: "Deploy feature",
            description: "Release feature to production",
          },
          {
            id: 14,
            title: "Document process",
            description: "Update project documentation",
          },
          {
            id: 15,
            title: "Client approval",
            description: "Obtain final client sign-off",
          },
        ],
      },
    ],
    popularity: 95,
    isPopular: true,
    tags: ["kanban", "project", "agile"],
    usageCount: 1250,
  },
  {
    id: "2",
    name: "Team Sprint Planning",
    description: "Lập kế hoạch sprint cho team phát triển phần mềm",
    category: "development",
    icon: Code,
    color: "bg-green-500",
    lists: [
      {
        id: 1,
        name: "Sprint Backlog",
        example_cards: [
          {
            id: 1,
            title: "Plan sprint goals",
            description: "Define sprint objectives",
          },
          {
            id: 2,
            title: "User story mapping",
            description: "Create user story breakdown",
          },
          {
            id: 3,
            title: "Estimate tasks",
            description: "Assign task effort points",
          },
        ],
      },
      {
        id: 2,
        name: "In Development",
        example_cards: [
          {
            id: 4,
            title: "Implement login API",
            description: "Develop and test login endpoint",
          },
          {
            id: 5,
            title: "UI for dashboard",
            description: "Design dashboard layout",
          },
          {
            id: 6,
            title: "Database migration",
            description: "Migrate user data to new schema",
          },
        ],
      },
      {
        id: 3,
        name: "Code Review",
        example_cards: [
          {
            id: 7,
            title: "Review login API",
            description: "Check login endpoint code quality",
          },
          {
            id: 8,
            title: "Dashboard UI review",
            description: "Validate dashboard design",
          },
          {
            id: 9,
            title: "Migration code review",
            description: "Ensure migration scripts are correct",
          },
        ],
      },
      {
        id: 4,
        name: "Testing",
        example_cards: [
          {
            id: 10,
            title: "Test login API",
            description: "Run unit tests for login endpoint",
          },
          {
            id: 11,
            title: "Dashboard UI testing",
            description: "Test dashboard responsiveness",
          },
          {
            id: 12,
            title: "Migration testing",
            description: "Verify data integrity post-migration",
          },
        ],
      },
      {
        id: 5,
        name: "Deployed",
        example_cards: [
          {
            id: 13,
            title: "Deploy login API",
            description: "Release login endpoint to production",
          },
          {
            id: 14,
            title: "Release dashboard",
            description: "Deploy dashboard to live environment",
          },
          {
            id: 15,
            title: "Complete migration",
            description: "Finalize data migration",
          },
        ],
      },
    ],
    popularity: 88,
    isPopular: true,
    tags: ["sprint", "development", "scrum"],
    usageCount: 980,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Quản lý chiến dịch marketing từ ý tưởng đến thực hiện",
    category: "marketing",
    icon: Target,
    color: "bg-purple-500",
    lists: [
      {
        id: 1,
        name: "Ideas",
        example_cards: [
          {
            id: 1,
            title: "Brainstorm campaign",
            description: "Generate creative campaign ideas",
          },
          {
            id: 2,
            title: "Identify audience",
            description: "Define target demographic",
          },
          {
            id: 3,
            title: "Research trends",
            description: "Analyze current market trends",
          },
        ],
      },
      {
        id: 2,
        name: "Planning",
        example_cards: [
          {
            id: 4,
            title: "Campaign brainstorming",
            description: "Generate campaign ideas",
          },
          {
            id: 5,
            title: "Budget planning",
            description: "Allocate campaign budget",
          },
          {
            id: 6,
            title: "Timeline setup",
            description: "Define campaign schedule",
          },
        ],
      },
      {
        id: 3,
        name: "Content Creation",
        example_cards: [
          {
            id: 7,
            title: "Social media post",
            description: "Create engaging post for Instagram",
          },
          {
            id: 8,
            title: "Email campaign",
            description: "Design promotional email",
          },
          { id: 9, title: "Blog post", description: "Write blog for campaign" },
        ],
      },
      {
        id: 4,
        name: "Review",
        example_cards: [
          {
            id: 10,
            title: "Review social post",
            description: "Check post for brand consistency",
          },
          {
            id: 11,
            title: "Email content review",
            description: "Validate email content",
          },
          {
            id: 12,
            title: "Blog review",
            description: "Proofread blog content",
          },
        ],
      },
      {
        id: 5,
        name: "Published",
        example_cards: [
          {
            id: 13,
            title: "Post to Instagram",
            description: "Publish social media post",
          },
          {
            id: 14,
            title: "Send email campaign",
            description: "Launch email to subscribers",
          },
          {
            id: 15,
            title: "Publish blog",
            description: "Release blog on website",
          },
        ],
      },
    ],
    popularity: 82,
    isPopular: true,
    tags: ["marketing", "campaign", "content"],
    usageCount: 756,
  },
  {
    id: "4",
    name: "Event Planning",
    description: "Tổ chức sự kiện từ A đến Z một cách có hệ thống",
    category: "event",
    icon: Calendar,
    color: "bg-orange-500",
    lists: [
      {
        id: 1,
        name: "Ideas",
        example_cards: [
          {
            id: 1,
            title: "Event theme",
            description: "Brainstorm event theme ideas",
          },
          {
            id: 2,
            title: "Venue options",
            description: "List potential venues",
          },
          {
            id: 3,
            title: "Guest speakers",
            description: "Identify potential speakers",
          },
        ],
      },
      {
        id: 2,
        name: "Planning",
        example_cards: [
          {
            id: 4,
            title: "Venue selection",
            description: "Choose event location",
          },
          {
            id: 5,
            title: "Budget planning",
            description: "Plan event expenses",
          },
          { id: 6, title: "Guest list", description: "Compile attendee list" },
        ],
      },
      {
        id: 3,
        name: "Vendors",
        example_cards: [
          {
            id: 7,
            title: "Caterer contract",
            description: "Finalize catering agreement",
          },
          {
            id: 8,
            title: "Decorator booking",
            description: "Hire event decorators",
          },
          {
            id: 9,
            title: "AV setup",
            description: "Arrange audio-visual equipment",
          },
        ],
      },
      {
        id: 4,
        name: "Execution",
        example_cards: [
          { id: 10, title: "Venue setup", description: "Set up event space" },
          {
            id: 11,
            title: "Catering coordination",
            description: "Manage catering on event day",
          },
          {
            id: 12,
            title: "Guest management",
            description: "Handle attendee check-in",
          },
        ],
      },
      {
        id: 5,
        name: "Follow-up",
        example_cards: [
          {
            id: 13,
            title: "Send thank-you notes",
            description: "Email attendees post-event",
          },
          {
            id: 14,
            title: "Review feedback",
            description: "Analyze event feedback forms",
          },
          {
            id: 15,
            title: "Close contracts",
            description: "Finalize vendor payments",
          },
        ],
      },
    ],
    popularity: 76,
    isPopular: false,
    tags: ["event", "planning", "organization"],
    usageCount: 432,
  },
  {
    id: "5",
    name: "Personal Task Management",
    description: "Quản lý công việc cá nhân hàng ngày hiệu quả",
    category: "personal",
    icon: Heart,
    color: "bg-pink-500",
    lists: [
      {
        id: 1,
        name: "Today",
        example_cards: [
          {
            id: 1,
            title: "Morning workout",
            description: "Complete 30-min exercise",
          },
          {
            id: 2,
            title: "Reply emails",
            description: "Respond to urgent emails",
          },
          {
            id: 3,
            title: "Buy groceries",
            description: "Purchase weekly groceries",
          },
        ],
      },
      {
        id: 2,
        name: "This Week",
        example_cards: [
          {
            id: 4,
            title: "Doctor appointment",
            description: "Schedule health checkup",
          },
          {
            id: 5,
            title: "Plan meals",
            description: "Create weekly meal plan",
          },
          { id: 6, title: "Clean house", description: "Organize living space" },
        ],
      },
      {
        id: 3,
        name: "Next Week",
        example_cards: [
          { id: 7, title: "Pay bills", description: "Settle utility bills" },
          {
            id: 8,
            title: "Plan vacation",
            description: "Research vacation destinations",
          },
          {
            id: 9,
            title: "Car maintenance",
            description: "Schedule car service",
          },
        ],
      },
      {
        id: 4,
        name: "Someday",
        example_cards: [
          {
            id: 10,
            title: "Learn coding",
            description: "Start online coding course",
          },
          {
            id: 11,
            title: "Home renovation",
            description: "Plan kitchen remodel",
          },
          { id: 12, title: "Read book", description: "Finish reading novel" },
        ],
      },
      {
        id: 5,
        name: "Done",
        example_cards: [
          {
            id: 13,
            title: "Completed workout",
            description: "Finished weekly exercise goal",
          },
          { id: 14, title: "Emails sent", description: "Cleared email inbox" },
          {
            id: 15,
            title: "Groceries bought",
            description: "Stocked pantry for week",
          },
        ],
      },
    ],
    popularity: 71,
    isPopular: false,
    tags: ["personal", "productivity", "gtd"],
    usageCount: 623,
  },
  {
    id: "6",
    name: "Product Roadmap",
    description: "Lập roadmap sản phẩm với các milestone rõ ràng",
    category: "product",
    icon: Rocket,
    color: "bg-indigo-500",
    lists: [
      {
        id: 1,
        name: "Ideas",
        example_cards: [
          {
            id: 1,
            title: "Feature brainstorming",
            description: "Generate new product features",
          },
          {
            id: 2,
            title: "User feedback",
            description: "Collect user suggestions",
          },
          {
            id: 3,
            title: "Market analysis",
            description: "Study competitor products",
          },
        ],
      },
      {
        id: 2,
        name: "Research",
        example_cards: [
          {
            id: 4,
            title: "Technical feasibility",
            description: "Assess technical requirements",
          },
          {
            id: 5,
            title: "User testing plan",
            description: "Design user testing process",
          },
          {
            id: 6,
            title: "Cost estimation",
            description: "Estimate development costs",
          },
        ],
      },
      {
        id: 3,
        name: "Development",
        example_cards: [
          {
            id: 7,
            title: "Build prototype",
            description: "Create initial product prototype",
          },
          {
            id: 8,
            title: "API integration",
            description: "Integrate with external APIs",
          },
          {
            id: 9,
            title: "UI development",
            description: "Develop user interface",
          },
        ],
      },
      {
        id: 4,
        name: "Testing",
        example_cards: [
          {
            id: 10,
            title: "Unit testing",
            description: "Test individual components",
          },
          {
            id: 11,
            title: "User acceptance testing",
            description: "Run UAT with beta users",
          },
          {
            id: 12,
            title: "Bug fixing",
            description: "Resolve identified issues",
          },
        ],
      },
      {
        id: 5,
        name: "Launch",
        example_cards: [
          {
            id: 13,
            title: "Release product",
            description: "Deploy product to production",
          },
          {
            id: 14,
            title: "Marketing launch",
            description: "Announce product release",
          },
          {
            id: 15,
            title: "User training",
            description: "Provide user onboarding guides",
          },
        ],
      },
    ],
    popularity: 85,
    isPopular: true,
    tags: ["product", "roadmap", "planning"],
    usageCount: 834,
  },
  {
    id: "7",
    name: "Content Calendar",
    description: "Lên lịch và quản lý nội dung trên các kênh truyền thông",
    category: "content",
    icon: BookOpen,
    color: "bg-teal-500",
    lists: [
      {
        id: 1,
        name: "Ideas",
        example_cards: [
          {
            id: 1,
            title: "Content brainstorming",
            description: "Generate content ideas",
          },
          {
            id: 2,
            title: "Trend research",
            description: "Analyze social media trends",
          },
          {
            id: 3,
            title: "Audience analysis",
            description: "Study target audience preferences",
          },
        ],
      },
      {
        id: 2,
        name: "Writing",
        example_cards: [
          {
            id: 4,
            title: "Write blog post",
            description: "Draft blog content",
          },
          {
            id: 5,
            title: "Create social post",
            description: "Design social media post",
          },
          {
            id: 6,
            title: "Email newsletter",
            description: "Write newsletter content",
          },
        ],
      },
      {
        id: 3,
        name: "Review",
        example_cards: [
          {
            id: 7,
            title: "Blog review",
            description: "Proofread blog content",
          },
          {
            id: 8,
            title: "Social post review",
            description: "Check post for brand voice",
          },
          {
            id: 9,
            title: "Newsletter review",
            description: "Validate newsletter content",
          },
        ],
      },
      {
        id: 4,
        name: "Scheduled",
        example_cards: [
          {
            id: 10,
            title: "Schedule blog",
            description: "Set blog publishing date",
          },
          {
            id: 11,
            title: "Schedule social post",
            description: "Plan social media post timing",
          },
          {
            id: 12,
            title: "Schedule newsletter",
            description: "Set newsletter send time",
          },
        ],
      },
      {
        id: 5,
        name: "Published",
        example_cards: [
          {
            id: 13,
            title: "Publish blog",
            description: "Release blog on website",
          },
          {
            id: 14,
            title: "Post to social media",
            description: "Share post on platforms",
          },
          {
            id: 15,
            title: "Send newsletter",
            description: "Distribute email newsletter",
          },
        ],
      },
    ],
    popularity: 79,
    isPopular: false,
    tags: ["content", "social media", "calendar"],
    usageCount: 567,
  },
  {
    id: "8",
    name: "Bug Tracking",
    description: "Theo dõi và xử lý lỗi phần mềm một cách có hệ thống",
    category: "development",
    icon: Zap,
    color: "bg-red-500",
    lists: [
      {
        id: 1,
        name: "Reported",
        example_cards: [
          {
            id: 1,
            title: "Login bug",
            description: "User cannot log in with valid credentials",
          },
          {
            id: 2,
            title: "UI glitch",
            description: "Button misaligned on mobile",
          },
          {
            id: 3,
            title: "Crash report",
            description: "App crashes on specific action",
          },
        ],
      },
      {
        id: 2,
        name: "Confirmed",
        example_cards: [
          {
            id: 4,
            title: "Verify login bug",
            description: "Reproduce login issue",
          },
          {
            id: 5,
            title: "Confirm UI glitch",
            description: "Validate button misalignment",
          },
          {
            id: 6,
            title: "Reproduce crash",
            description: "Test crash scenario",
          },
        ],
      },
      {
        id: 3,
        name: "In Progress",
        example_cards: [
          {
            id: 7,
            title: "Fix login bug",
            description: "Debug login authentication",
          },
          {
            id: 8,
            title: "Correct UI glitch",
            description: "Adjust button CSS",
          },
          {
            id: 9,
            title: "Resolve crash",
            description: "Patch crash-causing code",
          },
        ],
      },
      {
        id: 4,
        name: "Testing",
        example_cards: [
          {
            id: 10,
            title: "Test login fix",
            description: "Verify login functionality",
          },
          {
            id: 11,
            title: "Test UI fix",
            description: "Check button alignment",
          },
          {
            id: 12,
            title: "Test crash fix",
            description: "Ensure app stability",
          },
        ],
      },
      {
        id: 5,
        name: "Resolved",
        example_cards: [
          {
            id: 13,
            title: "Login bug fixed",
            description: "Login issue resolved",
          },
          {
            id: 14,
            title: "UI glitch corrected",
            description: "Button alignment fixed",
          },
          {
            id: 15,
            title: "Crash resolved",
            description: "App crash eliminated",
          },
        ],
      },
    ],
    popularity: 73,
    isPopular: false,
    tags: ["bug", "tracking", "development"],
    usageCount: 445,
  },
  {
    id: "9",
    name: "Team Onboarding",
    description: "Quy trình đào tạo và hướng dẫn nhân viên mới",
    category: "hr",
    icon: Users,
    color: "bg-cyan-500",
    lists: [
      {
        id: 1,
        name: "Pre-boarding",
        example_cards: [
          {
            id: 1,
            title: "Prepare documents",
            description: "Send employment contract",
          },
          {
            id: 2,
            title: "Set up accounts",
            description: "Create email and system access",
          },
          {
            id: 3,
            title: "Welcome package",
            description: "Prepare onboarding materials",
          },
        ],
      },
      {
        id: 2,
        name: "Week 1",
        example_cards: [
          {
            id: 4,
            title: "Team introduction",
            description: "Introduce new hire to team",
          },
          {
            id: 5,
            title: "Tool training",
            description: "Train on company tools",
          },
          {
            id: 6,
            title: "Role overview",
            description: "Explain job responsibilities",
          },
        ],
      },
      {
        id: 3,
        name: "Week 2",
        example_cards: [
          {
            id: 7,
            title: "Project assignment",
            description: "Assign initial tasks",
          },
          {
            id: 8,
            title: "Mentor check-in",
            description: "Schedule mentor meeting",
          },
          {
            id: 9,
            title: "Process training",
            description: "Train on workflows",
          },
        ],
      },
      {
        id: 4,
        name: "Month 1",
        example_cards: [
          {
            id: 10,
            title: "Performance review",
            description: "Conduct 30-day review",
          },
          {
            id: 11,
            title: "Goal setting",
            description: "Set short-term goals",
          },
          {
            id: 12,
            title: "Feedback session",
            description: "Gather new hire feedback",
          },
        ],
      },
      {
        id: 5,
        name: "Completed",
        example_cards: [
          {
            id: 13,
            title: "Onboarding complete",
            description: "Finalize onboarding process",
          },
          {
            id: 14,
            title: "Full integration",
            description: "New hire fully integrated",
          },
          {
            id: 15,
            title: "Document archive",
            description: "Store onboarding records",
          },
        ],
      },
    ],
    popularity: 68,
    isPopular: false,
    tags: ["onboarding", "hr", "training"],
    usageCount: 289,
  },
  {
    id: "10",
    name: "Daily Standup",
    description: "Theo dõi tiến độ công việc hàng ngày của team",
    category: "team",
    icon: Coffee,
    color: "bg-amber-500",
    lists: [
      {
        id: 1,
        name: "Yesterday",
        example_cards: [
          {
            id: 1,
            title: "Completed task A",
            description: "Finished coding feature X",
          },
          {
            id: 2,
            title: "Met with client",
            description: "Discussed project updates",
          },
          { id: 3, title: "Bug fixing", description: "Resolved issue Y" },
        ],
      },
      {
        id: 2,
        name: "Today",
        example_cards: [
          {
            id: 4,
            title: "Work on feature B",
            description: "Develop new functionality",
          },
          { id: 5, title: "Team sync", description: "Attend sprint planning" },
          {
            id: 6,
            title: "Test feature A",
            description: "Run tests on feature X",
          },
        ],
      },
      {
        id: 3,
        name: "Blockers",
        example_cards: [
          {
            id: 7,
            title: "API issue",
            description: "API endpoint not responding",
          },
          {
            id: 8,
            title: "Resource access",
            description: "Need database access",
          },
          {
            id: 9,
            title: "Dependency delay",
            description: "Waiting on third-party library",
          },
        ],
      },
      {
        id: 4,
        name: "Next",
        example_cards: [
          {
            id: 10,
            title: "Plan feature C",
            description: "Outline next feature specs",
          },
          {
            id: 11,
            title: "Review code",
            description: "Conduct code review for feature B",
          },
          {
            id: 12,
            title: "Update docs",
            description: "Document recent changes",
          },
        ],
      },
      {
        id: 5,
        name: "Notes",
        example_cards: [
          {
            id: 13,
            title: "Meeting notes",
            description: "Record standup discussion",
          },
          {
            id: 14,
            title: "Action items",
            description: "List follow-up tasks",
          },
          {
            id: 15,
            title: "Team feedback",
            description: "Summarize team input",
          },
        ],
      },
    ],
    popularity: 65,
    isPopular: false,
    tags: ["standup", "daily", "team"],
    usageCount: 356,
  },
];