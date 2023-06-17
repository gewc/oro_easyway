import express from "express";
import {
  getAllViewbyStore,
  createView,
  getViewByID,
  getViewByStoreName,
  getAllViewbyProduct,
  getViewByDevice,
  updateViewByStore,
  deactivateView,
} from "../controllers/view.controller.js";

const router = express.Router();

router.route("/:storeId").get(getAllViewbyStore);
router.route("/pviewer/:id").get(getAllViewbyProduct);
router.route("/").post(createView);
router.route("/product/:storeId").get(getViewByStoreName);
// router.route("/store/:store_name").get(getViewByStoreName);
// router.route("/device/:deviceId").get(getViewByDevice);
router.route("/:storeId/:pId").patch(updateViewByStore);
// router.route("/:id").delete(deactivateView);

export default router;
