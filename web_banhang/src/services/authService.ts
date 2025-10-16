export const loginUser = async (username: string, password: string) => {
  // fake delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (username === "admin" && password === "123456") {
    return { success: true, message: "Login successful!" };
  } else {
    return { success: false, message: "Invalid username or password" };
  }
};

export const registerUser = async (username: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Giả sử backend lưu thành công nếu username không rỗng và password >= 6 ký tự
  if (username && password.length >= 6) {
    return { success: true, message: "Register successful!" };
  } else {
    return { success: false, message: "Password must be at least 6 characters" };
  }
};
