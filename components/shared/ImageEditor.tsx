"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, CropIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type ImageEditorProps = {
  image: any;
  onTransform: (transformationConfig: any) => void;
  onSave: () => void;
  isTransforming: boolean;
};

const ImageEditor = ({ image, onTransform, onSave, isTransforming }: ImageEditorProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<HTMLImageElement | null>(null);

  // Khởi tạo canvas khi component mount và khi image thay đổi
  useEffect(() => {
    if (!image?.secureURL) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalImageData(img);
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Reset các tham số chỉnh sửa
        setRotation(0);
        setFlip({ horizontal: false, vertical: false });
        setCropMode(false);
        setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
        
        // Vẽ ảnh lên canvas
        drawImageOnCanvas(img);
      }
    };
    img.src = image.secureURL;
  }, [image?.secureURL]);

  // Vẽ ảnh lên canvas với các hiệu ứng hiện tại
  const drawImageOnCanvas = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Xóa canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Lưu trạng thái
      ctx.save();
      
      // Thiết lập các biến đổi
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
      
      // Vẽ ảnh
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      // Khôi phục trạng thái
      ctx.restore();
      
      // Vẽ vùng crop nếu đang trong chế độ crop
      if (cropMode && cropArea.width > 0 && cropArea.height > 0) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        
        // Làm tối vùng ngoài crop
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, cropArea.y); // Trên
        ctx.fillRect(0, cropArea.y + cropArea.height, canvas.width, canvas.height - (cropArea.y + cropArea.height)); // Dưới
        ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height); // Trái
        ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvas.width - (cropArea.x + cropArea.width), cropArea.height); // Phải
      }
    }
  };

  // Update canvas mỗi khi các tham số thay đổi
  useEffect(() => {
    if (originalImageData) {
      drawImageOnCanvas(originalImageData);
    }
  }, [rotation, flip, cropMode, cropArea, isDragging]);

  // Xử lý xoay ảnh
  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = (rotation + (direction === 'right' ? 90 : -90)) % 360;
    setRotation(newRotation);
  };

  // Xử lý lật ảnh
  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlip({ ...flip, horizontal: !flip.horizontal });
    } else {
      setFlip({ ...flip, vertical: !flip.vertical });
    }
  };

  // Xử lý mouse down để bắt đầu crop
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  // Xử lý mouse move để cập nhật kích thước vùng crop
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !cropMode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setCropArea({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y)
    });
  };

  // Xử lý mouse up để kết thúc crop
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Áp dụng biến đổi - được gọi từ button trong TransformationForm
  const handleApplyTransformation = () => {
    // Tạo config cho transformation
    const transformationConfig = {
      edit: {
        rotate: rotation,
        flip: { horizontal: flip.horizontal, vertical: flip.vertical },
        crop: cropMode && cropArea.width > 0 && cropArea.height > 0 ? {
          x: cropArea.x,
          y: cropArea.y,
          width: cropArea.width,
          height: cropArea.height
        } : undefined
      }
    };
    
    // Gửi config lên component cha
    onTransform(transformationConfig);

    toast({
      title: 'Transformation applied',
      description: 'Your changes have been applied to the image',
      duration: 3000,
      className: 'success-toast'
    });
  };

  // Khi nhấn Apply Transformation trong TransformationForm, sẽ nhận được config từ đây
  // và gửi lên Cloudinary để xử lý
  useEffect(() => {
    // Khi isTransforming được set, gửi cấu hình chỉnh sửa hiện tại
    if (isTransforming) {
      handleApplyTransformation();
    }
  }, [isTransforming]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="max-w-full h-auto"
          style={{ cursor: cropMode ? 'crosshair' : 'default' }}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => handleRotate('left')}
          className="flex items-center gap-1"
        >
          <RotateCcw size={16} /> Xoay trái
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => handleRotate('right')}
          className="flex items-center gap-1"
        >
          <RotateCw size={16} /> Xoay phải
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => handleFlip('horizontal')}
          className="flex items-center gap-1"
        >
          <FlipHorizontal size={16} /> Lật ngang
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => handleFlip('vertical')}
          className="flex items-center gap-1"
        >
          <FlipVertical size={16} /> Lật dọc
        </Button>
        
        <Button 
          type="button"
          variant={cropMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCropMode(!cropMode);
            if (!cropMode) {
              setCropArea({ x: 0, y: 0, width: 0, height: 0 });
            }
          }}
          className="flex items-center gap-1"
        >
          <CropIcon size={16} /> {cropMode ? 'Đang cắt ảnh' : 'Cắt ảnh'}
        </Button>
      </div>
    </div>
  );
};

export default ImageEditor;