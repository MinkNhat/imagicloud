import {Document, models, model, Schema} from "mongoose";

// interface giúp ts check kiểu dữ liệu và bảo toàn tính toàn vẹn dữ liệu
export interface IImage extends Document { 
    title: string; 
    transformationType: string; 
    publicId: string; 
    secureUrl: string; 
    width?: number; 
    height?: number; 
    config?: object; 
    transformationUrl?: string;
    aspectRatio?: string; 
    color?: string; 
    prompt?: string;
    author: {
        _id: string;
        firsName: string;
        lastName: string;
    }
    createdAt?: Date;
    updatedAt?: Date;
}

const ImageSchema= new Schema({
    title: {type: String, require : true},
    transformationType: {type: String, require : true}, // Loại transfor
    publicId: {type: String, require : true},
    secureUrl: {type: URL, require : true},
    width: {type: Number},
    height: {type: Number},
    config: {type: Object},
    transformationUrl: {type: URL}, // url sau khi transfor
    aspectRatio: {type: String}, // tỉ lệ ảnh
    color: {type: String},
    prompt: {type: String}, // lệnh để generate ảnh
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now} 

});

// check model đã tồn tại hay chưa, nếu chưa thì tạo mới
const Image = models?.Image || model('Image', ImageSchema);

export default Image;