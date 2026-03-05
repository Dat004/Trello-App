import { Star, TrendingUp } from "lucide-react";

import { PopularTemplatesSkeleton } from "@/Components/UI";
import TemplateItem from "./TemplateItem";

function PopularTemplates({ data = [], isLoading }) {
    if (isLoading) {
        return (
            <section className="mb-8">
                <div className="animate-pulse">
                    <div className="h-6 max-w-32 bg-muted rounded-md mb-6"></div>
                </div>
                <PopularTemplatesSkeleton />
            </section>
        );
    }

    if (data.length === 0) return null;

    return (
        <section>
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Mẫu phổ biến
                </h2>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.map((template) => (
                        <TemplateItem key={template._id} template={template} isPopular />
                    ))}
                </section>
            </section>
        </section>
    );
}

export default PopularTemplates;
