"use client";

import React from "react";
import Image from "next/image";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

function convertTransformationConfig(type: string, transformationConfig?: Transformations | null) {
  if (type !== 'edit' || !transformationConfig?.edit) {
    return transformationConfig;
  }

  const { edit, ...otherTransformations } = transformationConfig;
  const convertedConfig: any = { ...otherTransformations };

  // Xử lý crop
  if (edit.crop) {
    convertedConfig.crop = {
      type: 'crop',
      width: Math.round(edit.crop.width),
      height: Math.round(edit.crop.height),
      x: Math.round(edit.crop.x),
      y: Math.round(edit.crop.y)
    };
  }

  // Xử lý angle (rotate và flip)
  if (edit.rotate !== undefined && edit.flip) {
    const rotateDirection = edit.flip.horizontal ? 'hflip' : (edit.flip.vertical ? 'vflip' : '');
    if(rotateDirection !== '') 
      convertedConfig.angle = `${rotateDirection}.${edit.rotate}`;
    else 
      convertedConfig.angle = `${edit.rotate}`;
  } else if (edit.flip) {
    convertedConfig.angle = edit.flip.horizontal ? 'hflip' : (edit.flip.vertical ? 'vflip' : '');
  }
  console.log("convertedConfig", convertedConfig);
  return convertedConfig;
}

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  console.log(image)
  const transformations = convertTransformationConfig(type, transformationConfig);

  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  };

  return (
    <div className="flex flex-col gap-4">
        <div className="flex-between">
            <h3 className="h3-bold text-dark-600">Ảnh sau chỉnh sửa</h3>

            {hasDownload && (
                <button
                    className="download-btn"
                    onClick={downloadHandler}
                >
                    <Image
                        src="/assets/icons/download.svg"
                        alt="Download"
                        width={24}
                        height={24}
                        className="pb-[6px]"
                    />
                </button>
            )}
        </div>

        {image?.publicId && transformationConfig ? (   
            <div className="relative">
                <CldImage 
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={image?.publicId}
                  alt={title}
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="transformed-image"
                  format="jpg" 
                  onLoad={() => {
                    setIsTransforming && setIsTransforming(false);
                  }}
                  onError={() => {
                    debounce(() => {
                        setIsTransforming && setIsTransforming(false);
                    }, 8000)()
                  }}               
                  // angle="hflip.45"
                  // crop={{
                  //   type: 'crop',
                  //   width: 400,    
                  //   height: 840,   
                  //   x: 350,       
                  //   y: 815,         
                  // }}
                  
                  {...transformations}
                />

                {isTransforming && (
                    <div className="transforming-loader">
                        <Image
                            src="/assets/icons/spinner.svg"
                            width={50}
                            height={50}
                            alt="spinner"
                        />
                        <p className="text-white/80">Loading...</p>
                    </div>
                )}

            </div>
        ) : (
            <div className="transformed-placeholder">
                Ảnh sau khi chỉnh sửa
            </div>
        )}
    </div>
  );
};

export default TransformedImage;
