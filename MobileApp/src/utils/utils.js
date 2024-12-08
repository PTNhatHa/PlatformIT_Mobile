import { Linking } from "react-native";

export const formatDateTime = (date, isTime = false) => {
    if(date === null) return ""
    // Kiểm tra nếu date là chuỗi, thì chuyển đổi thành đối tượng Date
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return ''; // Trả về chuỗi rỗng nếu date không hợp lệ
    }
    // Định dạng ngày theo chuẩn của Mỹ
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if(isTime){
        options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Sử dụng định dạng 24 giờ
            timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
        };
    }
    return date ? date.toLocaleDateString('en-US', options) : '';
};

export const getTime = (date) => {
    if(date === null) return ""
    // Kiểm tra nếu date là chuỗi, thì chuyển đổi thành đối tượng Date
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return ''; // Trả về chuỗi rỗng nếu date không hợp lệ
    }
    // Định dạng ngày theo chuẩn của Mỹ
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Sử dụng định dạng 24 giờ
        timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
    };
    return date ? date.toLocaleTimeString('en-US', options) : '';
};

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}
export const determineFileType = (uri)=>{
    if(uri){
        const extension = uri.split('.').pop().toLowerCase()
        if(['jpg', 'jpeg', 'png', 'gif'].includes(extension)){
            return "Image"
        } else if(extension === 'pdf'){
            return "Pdf"
        } else{
            return "Unknown"
        }
    }
}
export const openLink = async(uri)=>{
    try{
        await Linking.openURL(uri)
    }
    catch(e){
        console.log("==>Error opening link: ", e);
    }
}

// Helper to calculate relative time
export const calculateRelativeTime = (timestamp) => {
    const now = new Date();
    const difference = Math.floor((now - timestamp) / 1000); // Difference in seconds

    if (difference < 60) return `${difference} seconds ago`;
    if (difference < 3600) return `${Math.floor(difference / 60)} minutes ago`;
    if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`;
    return `${Math.floor(difference / 86400)} days ago`;
};

// Helper to parse "relativeTime" into a timestamp
export const parseRelativeTime = (relativeTime) => {
    const now = new Date();
    const parts = relativeTime.split(" ");

    if (parts.includes("seconds")) {
        return new Date(now.getTime() - parseInt(parts[0], 10) * 1000);
    } else if (parts.includes("minutes")) {
        return new Date(now.getTime() - parseInt(parts[0], 10) * 60 * 1000);
    } else if (parts.includes("hours")) {
        return new Date(now.getTime() - parseInt(parts[0], 10) * 3600 * 1000);
    } else if (parts.includes("days")) {
        return new Date(now.getTime() - parseInt(parts[0], 10) * 86400 * 1000);
    }
    return now; // Default to current time if unrecognized format
};

export const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop();
    const mimeTypes = {
        // Hình ảnh
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        bmp: 'image/bmp',
        webp: 'image/webp',
        svg: 'image/svg+xml',

        // Tài liệu
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        txt: 'text/plain',
        csv: 'text/csv',

        // Âm thanh
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        ogg: 'audio/ogg',
        m4a: 'audio/mp4',

        // Video
        mp4: 'video/mp4',
        avi: 'video/x-msvideo',
        mov: 'video/quicktime',
        mkv: 'video/x-matroska',
        webm: 'video/webm',

        // Lập trình
        js: 'application/javascript',
        json: 'application/json',
        html: 'text/html',
        css: 'text/css',
        xml: 'application/xml',
        zip: 'application/zip',
        rar: 'application/vnd.rar',
        tar: 'application/x-tar',
        gz: 'application/gzip',
    };
    return mimeTypes[extension] || 'application/octet-stream';
}

// Hàm format thời gian (phút:giây)
export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};