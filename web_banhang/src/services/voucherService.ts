export interface Voucher {
  id: number;
  title: string;
  description: string;
  expiredAt: string;
  condition: string;
}

export const getVouchers = async (): Promise<Voucher[]> => {
  // Giả lập API call với dữ liệu mock
  return Promise.resolve([
    {
      id: 1,
      title: "Voucher 50K",
      description: "Giảm 50k cho đơn từ 999k",
      expiredAt: "2025-10-31",
      condition: "Áp dụng cho toàn bộ sản phẩm",
    },
    {
      id: 2,
      title: "Voucher 80K",
      description: "Giảm 80k cho đơn Online đầu tiên từ 399k",
      expiredAt: "2025-12-31",
      condition: "Chỉ áp dụng cho khách hàng mới",
    },
  ]);
};
