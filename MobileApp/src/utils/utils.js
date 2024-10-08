export const formatDateTime = (date) => {
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
    const extension = uri.split('.').pop().toLowerCase()
    if(['jpg', 'jpeg', 'png', 'gif'].includes(extension)){
        return "Image"
    } else if(extension === 'pdf'){
        return "Pdf"
    } else{
        return "Unknown"
    }
}