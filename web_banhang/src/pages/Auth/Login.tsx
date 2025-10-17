import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Đăng nhập thành công!");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="w-[350px] bg-white p-6 rounded-lg shadow-md border"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-[#274151] text-white py-2 rounded hover:bg-[#1c2e38]"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
