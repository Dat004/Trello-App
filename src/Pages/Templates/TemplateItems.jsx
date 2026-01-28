import { Copy, Eye } from "lucide-react";

import CreateBoardFromTemplateDialog from "@/Components/CreateBoardFromTemplateDialog";
import TemplatePreviewDialog from "@/Components/TemplatePreviewDialog";
import { getCategoryIcon } from "@/helpers/fileIcon";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/UI";

function TemplateItems({ template, isPopular = false }) {
    const ICON = getCategoryIcon[template.category];

    return (
        <Card
            key={template._id}
            className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
            <CardHeader className="pb-3">
            <section className="flex items-center gap-3">
                <section
                    className={`h-10 w-10 rounded-lg ${template.color} flex items-center justify-center`}
                >
                    <div className="text-white">
                        {<ICON className="h-5 w-5" />}
                    </div>
                </section>
                <section className="flex-1">
                    <CardTitle className="text-lg">
                        {template.name}
                    </CardTitle>
                    <section className="flex items-center gap-2 mt-1">
                        {template.is_popular && (
                            <Badge variant="secondary" className="text-xs leading-[1.15]">
                            {template.popularity_score}% phổ biến
                        </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {template.usage_count} lượt dùng
                        </span>
                    </section>
                </section>
            </section>
            </CardHeader>
            <CardContent className="pt-0">
            <CardDescription className="mb-4 line-clamp-2">
                {template.description}
            </CardDescription>
            <section className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">
                    Các cột:
                </p>
                <section className="flex flex-wrap gap-1">
                    {template.lists.slice(0, 3).map((list) => (
                        <Badge
                            key={list._id}
                            variant="outline"
                            className="text-xs leading-[1.15]"
                        >
                            {list.name}
                        </Badge>
                    ))}
                    {template.lists.length > 3 && (
                        <Badge
                            variant="outline"
                            className="text-xs leading-[1.15]"
                        >
                            +{template.lists.length - 3}
                        </Badge>
                    )}
                </section>
            </section>
            <section className="flex gap-2 mb-4">
                <TemplatePreviewDialog
                    template={template}
                    trigger={
                        <Button
                            size="sm"
                            variant="outline"
                            className="leading-1.5 gap-2 text-xs bg-transparent h-8 sm:h-9"
                        >
                            <Eye className="h-4 w-4" />
                            {isPopular ? "Xem trước": "Xem"}
                        </Button>
                    }
                />
                <CreateBoardFromTemplateDialog
                    template={template}
                    trigger={
                        <Button
                            size="sm"
                            className="leading-1.5 gap-2 text-xs flex-1 h-8 sm:h-9"
                        >
                            <Copy className="h-4 w-4" />
                            {isPopular ? "Sử dụng mẫu": "Dùng"}
                        </Button>
                    }
                />
            </section>
            {isPopular && (
                <section className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs leading-[1.15]"
                        >
                            {tag}
                        </Badge>
                    ))}
                </section>
            )}
            </CardContent>
        </Card>
    )
}

export default TemplateItems
