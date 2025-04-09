"use client";

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    if(type !== "edit") {
      toast({
        title: 'Tải ảnh lên thành công',
        description: 'Bạn đã sử dụng 1 credit!',
        duration: 5000,
        className: 'success-toast' 
      })
    }
  }

  const onUploadErrorHandler = () => {
    toast({
      title: 'Có lỗi xảy ra khi tải ảnh lên',
      description: 'Vui lòng kiểm tra lại!',
      duration: 5000,
      className: 'error-toast' 
    })
  }

  return (
    <CldUploadWidget
      uploadPreset="imagicloud"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">
            Ảnh gốc
          </h3>

          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage 
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ): (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image 
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
                <p className="p-14-medium">Tải ảnh lên</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader