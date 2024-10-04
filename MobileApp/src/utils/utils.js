export const formatDateTime = (date) => {
    // Định dạng ngày theo chuẩn của Mỹ
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date ? date.toLocaleDateString('en-US', options) : '';
};