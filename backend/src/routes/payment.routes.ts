import { Router } from "express";
import { paymentController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requirePayments } from "../middleware/rbac.middleware";
import { validateReceivablesQuery, validateStartCheckout, validateSyncPayment } from "../validators/payment.validator";

// The Stripe webhook is mounted in app.ts (it needs the raw body, before express.json).
const router = Router();
router.use(authenticate(), requirePayments);

router.get("/receivables", validateReceivablesQuery, paymentController.receivables);
router.get("/summary", paymentController.summary);
router.post("/checkout", validateStartCheckout, paymentController.checkout);
router.post("/sync", validateSyncPayment, paymentController.sync);

export default router;
