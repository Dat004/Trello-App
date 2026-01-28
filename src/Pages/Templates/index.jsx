import { useState, useEffect } from "react";
import { Search, Star, TrendingUp } from "lucide-react";

import {
  Button,
  TemplatesSkeleton,
  PopularTemplatesSkeleton,
} from "@/Components/UI";
import { templatesApi } from "@/api/templates";
import TemplateItems from "./TemplateItems";

function Templates() {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setIsLoading(true);

    const fetchTemplates = async () => {
      const [templates, popularTemplates] = await Promise.all([
        templatesApi.getAllTemplates(),
        templatesApi.getPopularTemplates(),
      ])
      
      setTemplates(templates.data.data.templates);
      setPopularTemplates(popularTemplates.data.data.templates);
      
      setIsLoading(false);
    };

    fetchTemplates();
  }, []);

  // const categories = [
  //   { value: "all", label: "Tất cả" },
  //   { value: "project-management", label: "Quản lý dự án" },
  //   { value: "development", label: "Phát triển" },
  //   { value: "marketing", label: "Marketing" },
  //   { value: "personal", label: "Cá nhân" },
  //   { value: "team", label: "Nhóm" },
  //   { value: "event", label: "Sự kiện" },
  //   { value: "product", label: "Sản phẩm" },
  //   { value: "content", label: "Nội dung" },
  //   { value: "hr", label: "Nhân sự" },
  // ];

  // const handleUseTemplate = (template, boardName, workspaceId) => {
  //   // Tăng usage count
  //   setTemplates((prev) =>
  //     prev.map((t) =>
  //       t.id === template.id ? { ...t, usageCount: (t.usageCount || 0) + 1 } : t
  //     )
  //   );

  //   // Navigate to the new board
  // };

  // const filteredTemplates = templates.filter((template) => {
  //   const matchesSearch =
  //     template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     template.tags.some((tag) =>
  //       tag.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   const matchesCategory =
  //     selectedCategory === "all" || template.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  const totalUsage = popularTemplates.reduce((sum, t) => sum + (t.usage_count || 0), 0);

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-col mb-6 md:mb-8 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Mẫu bảng
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Bắt đầu nhanh chóng với các mẫu bảng được thiết kế sẵn cho nhiều mục
            đích khác nhau
          </p>
        </section>
        <section className="sm:ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{totalUsage} lượt sử dụng</span>
        </section>
      </div>

      {/* Popular Templates */}
      <section className="mb-8">
        {isLoading ? (
          <>
            <div className="animate-pulse">
              <div className="h-6 max-w-32 bg-muted rounded-md mb-6"></div>
            </div>
            <PopularTemplatesSkeleton />
          </>
        ) : (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Mẫu phổ biến
            </h2>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularTemplates.map((template) => (
                <TemplateItems key={template._id} template={template} isPopular />
              ))}
            </section>
          </section>
        )}
      </section>

      {/* Search and Filter */}
      {/* <section className="mb-6">
        <section className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm mẫu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      </section> */}

      {/* All Templates */}
      <section>
        {isLoading ? (
          <>
            <div className="animate-pulse">
              <div className="h-6 max-w-32 bg-muted rounded-md mb-6"></div>
            </div>
            <TemplatesSkeleton />
          </>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {searchQuery || selectedCategory !== "all"
                  ? `Kết quả (${templates.length})`
                  : "Tất cả mẫu"}
              </h2>
            </div>

            {templates.length === 0 ? (
              <section className="text-center py-12">
                <section className="max-w-md mx-auto">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Không tìm thấy mẫu nào
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thử thay đổi từ khóa tìm kiếm hoặc danh mục để tìm mẫu phù
                    hợp
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </section>
              </section>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templates.map((template, index) => (
                  <section
                    key={template._id}
                    className="group transition-all duration-200 hover:-translate-y-1 animate-slide-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TemplateItems template={template} />
                  </section>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </>
  );
}

export default Templates;
