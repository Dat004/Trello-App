export const downloadFile = async (url, fileName) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        // Clean
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        return true;
    } catch (error) {
        console.error("Download util error:", error);
        window.open(url, "_blank");
        return false;
    }
};