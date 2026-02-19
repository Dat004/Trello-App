import { Loader2 } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RequestAccessDialog from '@/Components/RequestAccessDialog';
import { Button } from '@/Components/UI';
import { UserToast } from '@/context/ToastContext';
import { useBoardDetail } from '../api/useBoardDetail';
import { BoardStateProvider } from '../context/BoardStateContext';

const BoardContext = createContext(null);

export const useBoardAccess = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error("useBoardAccess must be used within a BoardAccessGuard");
    }
    return context;
};

export const BoardAccessGuard = ({ children }) => {
    const { id: boardId } = useParams();
    const navigate = useNavigate();
    const { addToast } = UserToast();
    
    // Fetch Server State via React Query
    // Expected response data structure: 
    // { board: {...}, is_member: bool, read_only: bool, redirect_workspace_id: string }
    const { data: boardData, isLoading, error } = useBoardDetail(boardId);
    
    const [showRequestDialog, setShowRequestDialog] = useState(true);

    // Handle Redirects (Case 2: Workspace Board - Non-Member)
    useEffect(() => {
        if (boardData?.redirect_workspace_id) {
            addToast({
                title: "Bạn cần tham gia Workspace để xem bảng này",
                type: "info"
            });
            navigate(`/workspaces/${boardData.redirect_workspace_id}`, { replace: true });
        }
    }, [boardData, navigate, addToast]);

    if (isLoading) {
        return (
            <div className="flex bg-background items-center justify-center h-screen w-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !boardData) {
         return (
             <div className="flex flex-col items-center justify-center h-screen w-full gap-4 bg-background">
                 <h2 className="text-2xl font-bold text-foreground">Không thể tải bảng</h2>
                 <p className="text-muted-foreground text-center max-w-md">
                    {error?.message || "Bảng không tồn tại hoặc bạn không có quyền truy cập."}
                 </p>
                 <Button onClick={() => navigate('/boards')} variant="outline">
                    Quay về danh sách bảng
                 </Button>
             </div>
         );
    }
    
    // If redirecting, return null to avoid flash of content
    if (boardData.redirect_workspace_id) return null;

    // Normalize data
    // API returns { board: {...}, is_member: ..., read_only: ... }
    // But sometimes might return just board object if not wrapped properly, so we handle both.
    const board = boardData.board || boardData; 
    
    // Explicit flags from API response take precedence
    const isMember = boardData.is_member ?? false;
    // If API says read_only, trust it. Otherwise default to !isMember (guests are read-only)
    const readOnly = boardData.read_only ?? !isMember;
    const visibility = board.visibility;

    // Case 1: Private Board & Non-Member -> Request Access
    if (!isMember && visibility === 'private') {
         return (
            <div className="h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <RequestAccessDialog
                    entity={board}
                    type="board"
                    open={showRequestDialog}
                    onOpenChange={(open) => !open && window.history.back()}
                    hasPendingRequest={boardData.has_pending_request}
                    requested_at={boardData.requested_at}
                />
            </div>
         );
    }

    // Case 3: Public/Workspace Board (Member or Guest) -> Render Content
    return (
        <BoardContext.Provider value={{ 
            board, 
            isMember,
            readOnly
        }}>
            {/* Pass raw boardData to BoardStateProvider so normalizeBoard can parse it correctly */}
            <BoardStateProvider serverBoard={boardData}>
                {children}
            </BoardStateProvider>
        </BoardContext.Provider>
    );
};
