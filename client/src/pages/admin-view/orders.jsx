"use client";

import AdminOrdersView from "@/components/admin-view/orders";

function AdminOrders() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"></div>

      <AdminOrdersView />
    </div>
  );
}

export default AdminOrders;
