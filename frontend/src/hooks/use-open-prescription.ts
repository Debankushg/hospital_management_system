import { useMutation } from "@tanstack/react-query";
import { prescriptionService } from "@/services/prescription.service";
import { openBlankTab, showPdfInTab } from "@/utils/open-pdf.util";

/** Downloads a prescription PDF and opens it in a new tab. */
export function useOpenPrescription() {
  return useMutation({
    meta: { toastError: true },
    mutationFn: async (id: string) => {
      const tab = openBlankTab();
      try {
        showPdfInTab(tab, await prescriptionService.fetchPdf(id));
      } catch (e) {
        tab?.close();
        throw e;
      }
    },
  });
}
