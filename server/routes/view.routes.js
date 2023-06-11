import express from "express";
import {
  getAllViewbyStore,
  createView,
  getViewByID,
  getViewByStoreName,
  getViewByDevice,
  updateViewByStore,
  deactivateView,
} from "../controllers/view.controller.js";

const router = express.Router();

router.route("/:storeId").get(getAllViewbyStore);
router.route("/").post(createView);
// router.route("/:id").get(getViewByID);
// router.route("/store/:store_name").get(getViewByStoreName);
// router.route("/device/:deviceId").get(getViewByDevice);
router.route("/:storeId").patch(updateViewByStore);
// router.route("/:id").delete(deactivateView);

export default router;
