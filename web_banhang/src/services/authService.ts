export const loginUser = async (email: string, password: string) => {
  // fake delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (email === "admin@test.com" && password === "123456") {
    return { success: true, message: "Login successful!" };
  } else {
    return { success: false, message: "Invalid email or password" };
  }
};

export const registerUser = async (name: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Giả sử backend lưu thành công nếu name không rỗng và password >= 6 ký tự
  if (name && password.length >= 6) {
    return { success: true, message: "Register successful!" };
  } else {
    return { success: false, message: "Password must be at least 6 characters" };
  }
};
