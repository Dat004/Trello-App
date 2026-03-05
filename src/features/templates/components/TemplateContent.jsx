import { Sparkles, TrendingUp } from "lucide-react";

import { useTemplates, usePopularTemplates } from "@/features/templates/api/useTemplates";
import AiTemplateGenerator from "./AiTemplateGenerator";
import PopularTemplates from "./PopularTemplates";
import AllTemplates from "./AllTemplates";

function TemplateContent() {
    const { data: templates = [], isLoading: loadingTemplates } = useTemplates();
    const { data: popularTemplates = [], isLoading: loadingPopularTemplates } = usePopularTemplates();
    const totalUsage = popularTemplates.reduce(
        (sum, t) => sum + (t.usage_count || 0),
        0
    );

    return (
        <section>
            <div className="flex flex-col mb-6 md:mb-8 sm:flex-row sm:items-center sm:justify-between gap-4">
                <section>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                    Mẫu bảng
                    </h1>
                    <p className="text-sm sm:text-base md:text-base text-muted-foreground">
                    Bắt đầu nhanh chóng với các mẫu bảng được thiết kế sẵn cho nhiều
                    mục đích khác nhau
                    </p>
                </section>
                <section className="sm:ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>{totalUsage} lượt sử dụng</span>
                </section>
            </div>
            {/* AI Template Generator */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Tạo template mới
                </h2>
                <AiTemplateGenerator />
            </div>

            {/* Popular Templates */}
            <PopularTemplates data={popularTemplates} isLoading={loadingPopularTemplates} />

            {/* All Templates */}
            <AllTemplates templates={templates} isLoading={loadingTemplates} />
        </section>
    )
}

export default TemplateContent;

