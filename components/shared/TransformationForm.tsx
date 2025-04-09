"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { Type } from "lucide-react"
import { startTransition, useEffect, useState, useTransition } from "react"
import { Value } from "@radix-ui/react-select"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { config, title } from "process"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import { set } from "mongoose"
import { InsufficientCreditsModal } from "./InsufficientCreditsModel"
import ImageEditor from "./ImageEditor"

// Định nghĩa các schema cho form
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type]
  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Khởi tạo giá trị, nếu là update thì lấy giá trị từ data, nếu không thì lấy giá trị mặc định ( obj rỗng )
  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues

  // Định nghĩa form bằng giá trị đã khởi tạo
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  // Định nghĩa action khi submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if(data || image) {
      // const transformationUrl = getCldImageUrl({
      //   width: image?.width,
      //   height: image?.height,
      //   src: image?.publicId,
      //   ...transformationConfig
      // })
      let transformationUrl;
    
    if (type === "edit") {
      const transforms: string[] = [];
      
      // Thêm xoay nếu có
      if (transformationConfig?.edit?.rotate) {
        transforms.push(`a_${transformationConfig.edit.rotate}`);
      }
      
      // Thêm lật ngang nếu có
      if (transformationConfig?.edit?.flip?.horizontal) {
        transforms.push("e_hflip");
      }
      
      // Thêm lật dọc nếu có
      if (transformationConfig?.edit?.flip?.vertical) {
        transforms.push("e_vflip");
      }
      
      // Thêm cắt ảnh nếu có
      if (transformationConfig?.edit?.crop) {
        transforms.push(`c_crop,x_${transformationConfig.edit.crop.x},y_${transformationConfig.edit.crop.y},w_${transformationConfig.edit.crop.width},h_${transformationConfig.edit.crop.height}`);
      }

      transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        transformations: transforms,
      });
    } else {
      // Xử lý cho các type khác
      transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      });
    }

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }

      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.error(error)
        }
      }

      if (action === "Update") {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    setIsSubmitting(false)
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config)

    return onChangeField(value)
  }

  // khi change input ( sử dụng debounce )
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }))
    }, 1000)()

    return onChangeField(value)
  }

  // update credits khi thực hiện transform
  const onTransformHandler = async () => {

    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));
    console.log(transformationConfig);
    setIsTransforming(true);
    setNewTransformation(null);

    if(type !== "edit") {
      startTransition(async () => {
        await updateCredits(userId, creditFee);
      });
    } 
  }

  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground' || type === 'edit')) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && type !== "edit" && <InsufficientCreditsModal/>}
        {/* title image */}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Đặt tên ảnh"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {/* nếu type là fill, có thêm input chọn tỉ lệ ảnh */}
        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Tỉ lệ khung ảnh"
            className="w-full"
            render={({ field }) => (
              <Select onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Chọn tỉ lệ" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {/* nếu type là remove hoặc recolor, có input nhập prompt để thực hiện lệnh */}
        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === "remove" ? "Vật thể muốn xoá" : "Vật thể muốn đổi màu"}
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) =>
                    onInputChangeHandler("prompt", e.target.value, type, field.onChange)
                  }
                />
              )}
            />

            {/* nếu là recolor có thêm input chỉ định màu cần chuyển đổi */}
            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Màu sắc mong muốn"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) =>
                      onInputChangeHandler("color", e.target.value, "recolor", field.onChange)
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        {/* MediaUploader và chức năng edit image */}
        {type === "edit" ? (
          <div className="flex size-full">
            {/* Chỉ hiển thị MediaUploader khi chưa có ảnh */}
            {!image?.publicId ? (
              <CustomField
                control={form.control}
                name="publicId"
                className="flex size-full flex-col"
                render={({ field }) => (
                  <MediaUploader
                    onValueChange={field.onChange}
                    setImage={setImage}
                    publicId={field.value}
                    image={image}
                    type={type}
                  />
                )}
              />
            ) : (
              <div className="flex size-full flex-col">
                <h3 className="h3-bold text-dark-600 mb-4">
                  {/* Edit Image */}
                </h3>
                <ImageEditor
                  image={image}
                  onTransform={(config) => {
                    setTransformationConfig(config);
                    setIsTransforming(true);
                    // Không trừ credit khi edit
                  }}
                  onSave={form.handleSubmit(onSubmit)}
                  isTransforming={isTransforming}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="media-uploader-field">
            <CustomField
              control={form.control}
              name="publicId"
              className="flex size-full flex-col"
              render={({ field }) => (
                <MediaUploader
                  onValueChange={field.onChange}
                  setImage={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
              )}
            />

            <TransformedImage
              image={image}
              type={type}
              title={form.getValues().title}
              isTransforming={isTransforming}
              setIsTransforming={setIsTransforming}
              transformationConfig={transformationConfig}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Button apply transformation */}
          {type === "edit" ? (
            <Button
              type="button"
              className="submit-button capitalize"
              disabled={isTransforming || !image?.publicId}
              onClick={onTransformHandler}
            >
              {isTransforming ? "Đang áp dụng..." : "Áp dụng"}
            </Button>
          ) : (
            <Button
              type="button"
              className="submit-button capitalize"
              disabled={isTransforming || newTransformation === null}
              onClick={onTransformHandler}
            >
              {isTransforming ? "Đang áp dụng..." : "Áp dụng"}
            </Button>
          )}

          {/* Button submit */}
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu ảnh..." : "Lưu ảnh"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm