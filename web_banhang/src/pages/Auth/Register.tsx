import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      await register(username, email, password);
      alert("Đăng ký thành công!");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Đăng ký thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="w-[350px] bg-white p-6 rounded-lg shadow-md border"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-[#274151] text-white py-2 rounded hover:bg-[#1c2e38]"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Register;