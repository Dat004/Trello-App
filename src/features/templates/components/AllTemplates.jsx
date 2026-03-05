import { Search } from "lucide-react";

import { TemplatesSkeleton } from "@/Components/UI";
import TemplateItem from "./TemplateItem";

function AllTemplates({ templates = [], isLoading }) {
  if (isLoading) {
    return (
      <section>
        <div className="animate-pulse">
          <div className="h-6 max-w-32 bg-muted rounded-md mb-6"></div>
        </div>
        <TemplatesSkeleton />
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tất cả mẫu</h2>
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
              Chưa có mẫu nào được tạo. Hãy sử dụng AI để tạo template mới!
            </p>
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
              <TemplateItem template={template} />
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

export default AllTemplates;
