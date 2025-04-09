// navbar links -> url và label của các item trong navbar
export const navLinks = [
    {
      label: "Home",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Edit Image",
      route: "/transformations/add/edit",
      icon: "/assets/icons/edit.svg", 
    },
    {
      label: "Image Restore",
      route: "/transformations/add/restore",
      icon: "/assets/icons/image.svg",
    },
    {
      label: "Generative Fill",
      route: "/transformations/add/fill",
      icon: "/assets/icons/stars.svg",
    },
    {
      label: "Object Remove",
      route: "/transformations/add/remove",
      icon: "/assets/icons/scan.svg",
    },
    {
      label: "Object Recolor",
      route: "/transformations/add/recolor",
      icon: "/assets/icons/filter.svg",
    },
    {
      label: "Background Remove",
      route: "/transformations/add/removeBackground",
      icon: "/assets/icons/camera.svg",
    },
    {
      label: "Profile",
      route: "/profile",
      icon: "/assets/icons/profile.svg",
    },
    {
      label: "Buy Credits",
      route: "/credits",
      icon: "/assets/icons/bag.svg",
    },
  ];
  
  // Các gói add-on 
  export const plans = [
    {
      _id: 1,
      name: "Free",
      icon: "/assets/icons/free-plan.svg",
      price: 0,
      credits: 20,
      inclusions: [
        {
          label: "20 Credits miễn phí",
          isIncluded: true,
        },
        {
          label: "Truy cập các dịch vụ cơ bản",
          isIncluded: true,
        },
        {
          label: "Khách hàng thân thiết",
          isIncluded: false,
        },
        {
          label: "Nhận thông báo về các bản cập nhật",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Pro Package",
      icon: "/assets/icons/free-plan.svg",
      price: 5,
      credits: 120,
      inclusions: [
        {
          label: "120 Credits",
          isIncluded: true,
        },
        {
          label: "Truy cập các dịch vụ cơ bản và nâng cao",
          isIncluded: true,
        },
        {
          label: "Khách hàng thân thiết",
          isIncluded: true,
        },
        {
          label: "Nhận thông báo về các bản cập nhật",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Premium Package",
      icon: "/assets/icons/free-plan.svg",
      price: 20,
      credits: 500,
      inclusions: [
        {
          label: "500 Credits",
          isIncluded: true,
        },
        {
          label: "Truy cập các dịch vụ cơ bản và nâng cao",
          isIncluded: true,
        },
        {
          label: "Khách hàng thân thiết",
          isIncluded: true,
        },
        {
          label: "Nhận thông báo về các bản cập nhật",
          isIncluded: true,
        },
      ],
    },
  ];
  
  // các loại transform ( title, description, icon, config = flags để áp dụng vào CldImage)
  export const transformationTypes = {
    edit: {
      type: "edit",
      title: "Edit Image",
      subTitle: "Xoay, lật hoặc cắt ảnh để có được bố cục hoàn hảo",
      config: { 
        edit: { 
          crop: { x: 0, y: 0, width: 0, height: 0 },
          rotate: 0,
          flip: { horizontal: false, vertical: false }
        } 
      },
      icon: "edit.svg",
    },
    restore: {
      type: "restore",
      title: "Restore Image",
      subTitle: "Biến ký ức mờ nhạt trở nên rõ ràng, sống động chỉ trong tíc tắc",
      config: { restore: true },
      icon: "image.svg",
    },
    removeBackground: {
      type: "removeBackground",
      title: "Background Remove",
      subTitle: "Xóa phông nhanh chóng, chính xác, mang đến hình ảnh hoàn hảo trong vài giây",
      config: { removeBackground: true },
      icon: "camera.svg",
    },
    fill: {
      type: "fill",
      title: "Generative Fill",
      subTitle: "Tạo ra các chi tiết mới mẻ, liền mạch cho hình ảnh của bạn nhờ Cloudinary AI",
      config: { fillBackground: true },
      icon: "stars.svg",
    },
    remove: {
      type: "remove",
      title: "Object Remove",
      subTitle: "Xóa bỏ mọi vật thể không mong muốn trong ảnh, giữ lại khung hình đẹp như ý",
      config: {
        remove: { prompt: "", removeShadow: true, multiple: true },
      },
      icon: "scan.svg",
    },
    recolor: {
      type: "recolor",
      title: "Object Recolor",
      subTitle: "Tùy chỉnh màu sắc chi tiết trong hình ảnh, tạo phong cách độc đáo và diện mạo mới mẻ",
      config: {
        recolor: { prompt: "", to: "", multiple: true },
      },
      icon: "filter.svg",
    },
  };
  
  // Các tỉ lệ để generate ảnh
  export const aspectRatioOptions = {
    "1:1": {
      aspectRatio: "1:1",
      label: "Square (1:1)",
      width: 1000,
      height: 1000,
    },
    "3:4": {
      aspectRatio: "3:4",
      label: "Standard Portrait (3:4)",
      width: 1000,
      height: 1334,
    },
    "9:16": {
      aspectRatio: "9:16",
      label: "Phone Portrait (9:16)",
      width: 1000,
      height: 1778,
    },
  };
  
  // default value để gán nếu là create
  export const defaultValues = {
    title: "",
    aspectRatio: "",
    color: "",
    prompt: "",
    publicId: "",
  };
  
  // mức phí khi upload ảnh 
  export const creditFee = -1;