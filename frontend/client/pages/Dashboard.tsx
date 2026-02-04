import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome to Fashion Admin
          </h2>
          <p className="text-gray-600 mb-8">
            Manage your fashion store's products, inventory, orders, and customers
            from this dashboard.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-[#f5ede0] to-[#ece5d8] rounded-lg border border-[#d4cbc0]">
              <h3 className="font-semibold text-gray-900 mb-2">Products</h3>
              <p className="text-2xl font-bold text-[#c9a876]">1,250</p>
              <p className="text-sm text-gray-600">Total items</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-[#f5ede0] to-[#ece5d8] rounded-lg border border-[#d4cbc0]">
              <h3 className="font-semibold text-gray-900 mb-2">Orders</h3>
              <p className="text-2xl font-bold text-[#c9a876]">342</p>
              <p className="text-sm text-gray-600">This month</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-[#f5ede0] to-[#ece5d8] rounded-lg border border-[#d4cbc0]">
              <h3 className="font-semibold text-gray-900 mb-2">Customers</h3>
              <p className="text-2xl font-bold text-[#c9a876]">8,940</p>
              <p className="text-sm text-gray-600">Total registered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
