import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, Label } from "@/Components/UI";

function CardMembers({ card }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Thành viên
        </Label>
        {/* Future: Add member button */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setShowMemberSelector(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Thêm
        </Button> */}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {card && card.members.length > 0 ? (
          card.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                />
                <AvatarFallback className="text-xs">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-[100px] truncate">
                {member.name}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">Chưa có thành viên</p>
        )}
      </div>
    </div>
  );
}

export default CardMembers;
