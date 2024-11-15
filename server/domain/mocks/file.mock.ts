export const mockSizeZeroPDF = (fileName: string) =>
  new File([new Blob()], fileName, { type: "application/pdf" });
