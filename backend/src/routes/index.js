const express = require("express");

const categoriesRoutes = require("./categories.routes");
const menuItemsRoutes = require("./menuItems.routes");


const router = express.Router();

router.use("/categories", categoriesRoutes);
router.use("/menu-items", menuItemsRoutes);
// router.use("/ingredients", ingredientsRoutes);
// router.use("/addons", addonsRoutes);
// router.use("/staff", staffRoutes);
// router.use("/shifts", shiftsRoutes);
// router.use("/orders", ordersRoutes);
// router.use("/inventory-adjustments", inventoryAdjustmentsRoutes);
// router.use("/settings", settingsRoutes);

module.exports = router;