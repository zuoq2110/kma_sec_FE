import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
    const decodedToken = jwtDecode(token);
 
    if (!decodedToken.exp) {
       // Token không có thời gian hết hạn (exp)
       return false;
    }
 
    const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
 
    return currentTime < decodedToken.exp;
 }