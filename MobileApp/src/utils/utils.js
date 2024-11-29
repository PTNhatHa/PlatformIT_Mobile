import { Linking } from "react-native";

export const formatDateTime = (date) => {
    if(date === null) return ""
    // Kiểm tra nếu date là chuỗi, thì chuyển đổi thành đối tượng Date
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return ''; // Trả về chuỗi rỗng nếu date không hợp lệ
    }
    // Định dạng ngày theo chuẩn của Mỹ
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date ? date.toLocaleDateString('en-US', options) : '';
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

export const getFileTypeFromUrl = (url) => {
    if (!url) return null; // Trả về null nếu link không hợp lệ
  
    const extension = url.split('.').pop().split('?')[0].toLowerCase(); // Lấy phần mở rộng
    const typeMap = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
      video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
      audio: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
      archive: ['zip', 'rar', '7z', 'tar', 'gz'],
    };
  
    // Duyệt qua typeMap để kiểm tra phần mở rộng
    for (const [type, extensions] of Object.entries(typeMap)) {
      if (extensions.includes(extension)) {
        return type; // Trả về loại file nếu tìm thấy
      }
    }
  
    return 'unknown'; // Trả về 'unknown' nếu không tìm thấy
  }