
/**
 * Submits data to a Google Sheet via a Google Apps Script Web App.
 * @param data The data object to submit.
 * @returns A promise that resolves when the submission is complete.
 */
export const submitToGoogleSheet = async (data: Record<string, any>) => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!scriptUrl) {
        console.warn("VITE_GOOGLE_SHEET_URL is not set. Data will not be saved to Google Sheets.");
        return;
    }

    try {
        // We use no-cors mode because Google Apps Script redirects, which CORS blocks by default.
        // However, the request still goes through.
        await fetch(scriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log("Data submitted to Google Sheet");
    } catch (error) {
        console.error("Error submitting to Google Sheet:", error);
        // We don't throw here to avoid blocking the user flow if logging fails
    }
};
