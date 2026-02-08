'use client';

import { useConfirmDialog } from "@/store/useConfirmDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";



export function ConfirmDialog() { // 柔軟性のあるコンポーネント
    const { isOpen, message, onConfirm, close } = useConfirmDialog();

    const handleConfirm = () => {
        onConfirm();
        close();
    };

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>確認</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={close}>キャンセル</Button>
                    <Button variant="destructive" onClick={handleConfirm}>削除</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}