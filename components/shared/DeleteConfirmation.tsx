"use client";

import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteImage } from "@/lib/actions/image.actions";

import { Button } from "../ui/button";

export const DeleteConfirmation = ({ imageId }: { imageId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full rounded-full">
        <Button
          type="button"
          className="button h-[44px] w-full md:h-[54px]"
          variant="destructive"
        >
          Xoá ảnh
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-10">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn xoá ảnh?
          </AlertDialogTitle>
          <AlertDialogDescription className="p-16-regular">
            Điều này sẽ không thể hoàn tác, hãy cân nhắc trước khi thực hiện
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            className="border bg-red-500 text-white hover:bg-red-600"
            onClick={() =>
              startTransition(async () => {
                await deleteImage(imageId);
              })
            }
          >
            {isPending ? "Đang xoá..." : "Xoá"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};