import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
  TextArea,
} from "@/Components/UI";
import {
  useRequestReview,
  useMakeReviewDecision,
} from "@/features/boards/api/useCards";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useAuthStore } from "@/store";

function CardReview({ card, boardId, listId }) {
  const { boardData } = useBoardContext();
  const currentUser = useAuthStore((state) => state.user);

  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  // Track if user wants to override the previous reviewer when changes are requested
  const [changeReviewer, setChangeReviewer] = useState(false);

  const requestReviewMutation = useRequestReview();
  const makeDecisionMutation = useMakeReviewDecision();

  const boardMembers = boardData.boardMembers || [];
  const review = card.review || { status: "none" };

  const isPending = review.status === "pending";
  const isApproved = review.status === "approved";
  const isChangesRequested = review.status === "changes_requested";

  // Check if current user has Owner or Admin role on this board
  const currentBoardMember = boardMembers.find(
    (bm) => String(bm.user?._id || bm._id) === String(currentUser?._id)
  );
  const isBoardAdminOrOwner =
    currentBoardMember?.role === "owner" ||
    currentBoardMember?.role === "admin" ||
    String(boardData.currentBoard?.owner) === String(currentUser?._id);

  // Checks if user is assigned to card or created it
  const isCreatorOrAssignee =
    String(card.creator) === String(currentUser?._id) ||
    card.memberIds?.includes(currentUser?._id) ||
    card.members?.some(m => String(m._id || m) === String(currentUser?._id));

  // Eligible reviewers (Only board owners/admins)
  const eligibleReviewers = boardMembers.filter((bm) => {
    const member = bm.user || bm;
    const isAdminOrOwner = bm.role === "owner" || bm.role === "admin" || String(boardData.currentBoard?.owner) === String(member._id);
    return isAdminOrOwner;
  });

  const isDesignatedReviewer = review.reviewer && String(review.reviewer._id || review.reviewer) === String(currentUser?._id);
  const canDecide = isDesignatedReviewer || (isPending && isBoardAdminOrOwner);

  const handleRequestReview = (e) => {
    e.preventDefault();
    if (!selectedReviewerId) return;

    requestReviewMutation.mutate({
      boardId,
      listId,
      cardId: card._id,
      data: {
        reviewerId: selectedReviewerId,
        message: requestMessage,
      },
    }, {
      onSuccess: () => {
        setSelectedReviewerId("");
        setRequestMessage("");
        setChangeReviewer(false);
      }
    });
  };

  const handleDecision = (decision) => {
    makeDecisionMutation.mutate({
      boardId,
      listId,
      cardId: card._id,
      data: {
        decision,
        feedback,
      },
    }, {
      onSuccess: () => {
        setFeedback("");
      }
    });
  };

  const reviewerName = review.reviewer?.full_name || review.reviewer?.name || "Reviewer";
  const reviewerAvatar = review.reviewer?.avatar?.url || "";
  const reviewerId = review.reviewer?._id || review.reviewer || "";

  return (
    <div className="grid gap-4 p-4 rounded-xl border border-border bg-muted/20">
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          Phê duyệt công việc (Review)
        </h4>
        
        {/* Status Badge */}
        {isPending && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <Clock className="h-3 w-3" />
            Đang chờ duyệt
          </span>
        )}
        {isApproved && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Đã duyệt
          </span>
        )}
        {isChangesRequested && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            <AlertCircle className="h-3 w-3" />
            Cần chỉnh sửa
          </span>
        )}
        {review.status === "none" && (
          <span className="text-xs text-muted-foreground">Chưa gửi yêu cầu</span>
        )}
      </div>

      {/* --- ROLE: OWNER/ADMIN --- */}
      {isBoardAdminOrOwner && (
        <div className="grid gap-3">
          {review.status === "none" && (
            <p className="text-xs text-muted-foreground italic">
              Chưa có yêu cầu phê duyệt nào từ thành viên cho thẻ này.
            </p>
          )}

          {isPending && (
            <div className="grid gap-3">
              {/* Show who requested review */}
              <div className="text-xs p-3 rounded-lg border border-yellow-200/50 bg-yellow-50/20 dark:bg-yellow-950/10">
                <p className="font-semibold text-yellow-800 dark:text-yellow-500">
                  Thành viên đang yêu cầu bạn phê duyệt thẻ này.
                </p>
                {review.request_message && (
                  <p className="text-muted-foreground mt-1 italic">Lời nhắn: "{review.request_message}"</p>
                )}
              </div>

              {/* Feedback and buttons */}
              {canDecide && (
                <div className="grid gap-3 pt-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="feedback" className="text-xs font-semibold">
                      Góp ý/Nhận xét phê duyệt
                    </Label>
                    <TextArea
                      id="feedback"
                      placeholder="Nhập lý do nếu yêu cầu sửa lại, hoặc nhận xét duyệt..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[60px] text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDecision("approved")}
                      disabled={makeDecisionMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Duyệt hoàn thành
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecision("changes_requested")}
                      disabled={makeDecisionMutation.isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Yêu cầu chỉnh sửa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isChangesRequested && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200/50 bg-red-50/50 dark:bg-red-950/20 text-xs">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-400">
                  Đang chờ thành viên chỉnh sửa lại công việc.
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Lý do yêu cầu sửa đổi từ {reviewerName}: <strong className="text-foreground">"{review.feedback}"</strong>
                </p>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200/50 bg-green-50/50 dark:bg-green-950/20 text-xs">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-400">
                  Công việc đã được hoàn thành & phê duyệt!
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Người duyệt: <strong className="text-foreground">{reviewerName}</strong>
                </p>
                {review.feedback && (
                  <p className="mt-1.5 text-muted-foreground italic bg-background/50 p-2 rounded border">
                    Nhận xét: "{review.feedback}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- ROLE: REGULAR MEMBER --- */}
      {!isBoardAdminOrOwner && (
        <div className="grid gap-3">
          {/* Submitting requests */}
          {(review.status === "none" || isChangesRequested) && (
            <div className="grid gap-3">
              {isChangesRequested && review.feedback && (
                <div className="p-3 rounded-lg border border-red-200/50 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-800 dark:text-red-400 mb-1">
                  <p className="font-bold flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Yêu cầu sửa đổi từ {reviewerName}:
                  </p>
                  <p className="italic">"{review.feedback}"</p>
                </div>
              )}

              {/* Minimal 1-click resubmit option */}
              {isChangesRequested && reviewerId && !changeReviewer ? (
                <div className="flex flex-col gap-2 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    className="w-fit gap-1.5"
                    disabled={requestReviewMutation.isPending}
                    onClick={() => {
                      requestReviewMutation.mutate({
                        boardId,
                        listId,
                        cardId: card._id,
                        data: {
                          reviewerId: reviewerId,
                          message: "Đã sửa xong, xin duyệt lại.",
                        },
                      });
                    }}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Đã sửa xong - Gửi duyệt lại cho {reviewerName}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setChangeReviewer(true)}
                    className="text-xs text-primary hover:underline text-left w-fit"
                  >
                    Hoặc chọn người duyệt khác
                  </button>
                </div>
              ) : (
                /* Full selection form */
                <form onSubmit={handleRequestReview} className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="reviewer" className="text-xs">Chọn Leader/Admin phê duyệt</Label>
                    <select
                      id="reviewer"
                      value={selectedReviewerId}
                      onChange={(e) => setSelectedReviewerId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="">-- Chọn Leader/Admin --</option>
                      {eligibleReviewers.map((bm) => {
                        const member = bm.user || bm;
                        return (
                          <option key={member._id} value={member._id}>
                            {member.full_name || member.name}
                          </option>
                        );
                      })}
                    </select>
                    {eligibleReviewers.length === 0 && (
                      <p className="text-[10px] text-red-500">Board hiện tại chưa có Quản trị viên/Chủ sở hữu nào để chọn duyệt.</p>
                    )}
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="reqMessage" className="text-xs">Lời nhắn gửi reviewer (tùy chọn)</Label>
                    <Input
                      id="reqMessage"
                      placeholder="VD: Nhờ anh check giúp em xem giao diện..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      size="sm"
                      className="w-fit gap-1.5"
                      disabled={requestReviewMutation.isPending || eligibleReviewers.length === 0}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Gửi yêu cầu phê duyệt
                    </Button>
                    {changeReviewer && (
                      <button
                        type="button"
                        onClick={() => setChangeReviewer(false)}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Quay lại
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {isPending && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-200/50 bg-yellow-50/20 dark:bg-yellow-950/10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reviewerAvatar} />
                <AvatarFallback className="text-[10px] bg-yellow-100 text-yellow-800">
                  {reviewerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-yellow-800 dark:text-yellow-500">
                  Đang chờ {reviewerName} phê duyệt thẻ của bạn
                </p>
                {review.request_message && (
                  <p className="text-muted-foreground mt-1 italic">Lời nhắn của bạn: "{review.request_message}"</p>
                )}
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200/50 bg-green-50/50 dark:bg-green-950/20 text-xs">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-400">
                  Công việc của bạn đã được phê duyệt thành công!
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Người duyệt: <strong className="text-foreground">{reviewerName}</strong>
                </p>
                {review.feedback && (
                  <p className="mt-1.5 text-muted-foreground italic bg-background/50 p-2 rounded border">
                    Nhận xét: "{review.feedback}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CardReview;
