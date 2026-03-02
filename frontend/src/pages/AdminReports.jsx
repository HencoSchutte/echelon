import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";


export default function AdminReports() {
  const { user } = useUser();

  const [financial, setFinancial] = useState(null);
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const [financialRes, productRes, customerRes] = await Promise.all([
          axios.get("/api/reports/financial", config),
          axios.get("/api/reports/products", config),
          axios.get("/api/reports/customers", config),
        ]);

        setFinancial(financialRes.data);
        setProducts(productRes.data);
        setCustomers(customerRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        }
    };

    fetchReports();
  }, [user]);

  if (loading)
    return <p className="text-white text-center mt-24">Loading reports...</p>;

  /* -----------------------------
     CHART DATA
  ------------------------------*/

  const revenueSplitData = [
    { name: "New", value: financial.revenueSplit.new },
    { name: "Refurbished", value: financial.revenueSplit.refurbished },
  ];

  const categoryData = Object.entries(products.revenueByCategory).map(
    ([category, revenue]) => ({
      category,
      revenue,
    })
  );

  const tierData = Object.entries(
    products.revenueByPerformanceTier
  ).map(([tier, revenue]) => ({
    tier,
    revenue,
  }));

  const bestProducts = products.bestSellingProducts
    .slice(0, 6)
    .map((p) => ({
      name: p.name,
      sold: p.totalSold,
    }));

  return (
    <section className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 relative">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Admin Analytics
        </h1>
        <p className="text-gray-400 mb-8 max-w-xl">
            Insights into store revenue, best performing products, and customer activity.
        </p>

        <span className="text-sm text-gray-400">
            Store performance overview
        </span>
        </div>

      {/* FINANCIAL CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Revenue" value={`$${financial.totalRevenue.toFixed(2)}`} />
        <StatCard title="Profit" value={`$${financial.profit.toFixed(2)}`} />
        <StatCard title="Orders" value={financial.totalOrders} />
        <StatCard title="Avg Order" value={`$${financial.averageOrderValue}`} />
        </div>

      {/* CHARTS GRID */}
      <div className="grid xl:grid-cols-2 gap-10 mb-14">
        {/* Revenue Split */}
        <ChartCard title="Revenue Split">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueSplitData} dataKey="value" nameKey="name" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Best Selling Products */}
        <ChartCard title="Best Selling Products">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Category */}
        <ChartCard title="Revenue by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Performance Tier */}
        <ChartCard title="Performance Tier Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* TOP CUSTOMER */}
      {customers.highestSpendingCustomer && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_35px_rgba(99,102,241,0.25)]">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
                Top Customer
                </h2>

                <p className="text-lg font-medium">
                {customers.highestSpendingCustomer.name}
                </p>

                <p className="text-gray-400">
                {customers.highestSpendingCustomer.email}
                </p>

                <p className="mt-3 text-indigo-200 font-semibold">
                ${customers.highestSpendingCustomer.totalSpent.toFixed(2)} spent
                </p>
        </div>
      )}
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:scale-[1.02] transition">
      <p className="text-sm text-indigo-200">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] overflow-hidden transition">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-80 group-hover:opacity-100 transition" />

      <div className="relative">
        <h3 className="text-lg font-semibold mb-6 text-indigo-300">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
