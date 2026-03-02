import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 * @desc   Get financial report
 * @route  GET /api/reports/financial
 * @access Admin
 */
const getFinancialReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = { status: "complete" };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const report = await Order.aggregate([
    { $match: matchStage },

    { $unwind: "$products" },

    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    { $unwind: "$productDetails" },

    {
      $project: {
        quantity: "$products.quantity",
        revenue: {
          $multiply: [
            "$productDetails.price",
            "$products.quantity",
          ],
        },
        cost: {
          $multiply: [
            "$productDetails.costPrice",
            "$products.quantity",
          ],
        },
        condition: "$productDetails.condition",
        category: "$productDetails.category",
        orderId: "$_id",
      },
    },

    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$revenue" },
        totalCost: { $sum: "$cost" },
        totalOrders: { $addToSet: "$orderId" },

        newRevenue: {
          $sum: {
            $cond: [{ $eq: ["$condition", "new"] }, "$revenue", 0],
          },
        },

        refurbishedRevenue: {
          $sum: {
            $cond: [{ $eq: ["$condition", "refurbished"] }, "$revenue", 0],
          },
        },
      },
    },
  ]);

  if (!report.length) {
    return res.json({
      totalRevenue: 0,
      totalCost: 0,
      profit: 0,
      profitMargin: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      revenueSplit: {
        new: 0,
        refurbished: 0,
      },
    });
  }

  const totalRevenue = report[0].totalRevenue;
  const totalCost = report[0].totalCost;
  const totalOrders = report[0].totalOrders.length;
  const profit = totalRevenue - totalCost;

  res.json({
    totalRevenue,
    totalCost,
    profit,
    profitMargin:
      totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0,
    totalOrders,
    averageOrderValue:
      totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
    revenueSplit: {
      new: report[0].newRevenue,
      refurbished: report[0].refurbishedRevenue,
    },
  });
});


/**
 * @desc   Get product performance report
 * @route  GET /api/reports/products
 * @access Admin
 */
const getProductReport = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "complete" })
    .populate("products.product");

  const productStats = {};
  const categoryStats = {};
  const tierStats = {};

  orders.forEach((order) => {
    order.products.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;

      const revenue = product.price * quantity;
      const cost = product.costPrice * quantity;
      const profit = revenue - cost;

      /* ===============================
         PRODUCT STATS
      ================================= */
      if (!productStats[product._id]) {
        productStats[product._id] = {
          name: product.name,
          category: product.category,
          performanceTier: product.performanceTier,
          totalSold: 0,
          revenue: 0,
          profit: 0,
        };
      }

      productStats[product._id].totalSold += quantity;
      productStats[product._id].revenue += revenue;
      productStats[product._id].profit += profit;

      /* ===============================
         CATEGORY STATS
      ================================= */
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category] += revenue;

      /* ===============================
         PERFORMANCE TIER STATS
      ================================= */
      if (!tierStats[product.performanceTier]) {
        tierStats[product.performanceTier] = 0;
      }
      tierStats[product.performanceTier] += revenue;
    });
  });

  // Convert object to array & sort best sellers
  const sortedProducts = Object.values(productStats).sort(
    (a, b) => b.totalSold - a.totalSold
  );

  res.json({
    bestSellingProducts: sortedProducts,
    revenueByCategory: categoryStats,
    revenueByPerformanceTier: tierStats,
  });
});

/**
 * @desc   Get customer performance report
 * @route  GET /api/reports/customers
 * @access Admin
 */
const getCustomerReport = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "complete" })
    .populate("user", "name email");

  const customerStats = {};

  orders.forEach((order) => {
    const userId = order.user._id.toString();

    if (!customerStats[userId]) {
      customerStats[userId] = {
        name: order.user.name,
        email: order.user.email,
        totalSpent: 0,
        totalOrders: 0,
      };
    }

    customerStats[userId].totalSpent += order.totalPrice;
    customerStats[userId].totalOrders += 1;
  });

  // Calculate average order value
  Object.values(customerStats).forEach((customer) => {
    customer.averageOrderValue =
      customer.totalSpent / customer.totalOrders;
  });

  // Sort highest spender first
  const sortedCustomers = Object.values(customerStats).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  res.json({
    highestSpendingCustomer: sortedCustomers[0] || null,
    allCustomers: sortedCustomers,
  });
});


export {
  getFinancialReport,
  getProductReport,
  getCustomerReport,
};

