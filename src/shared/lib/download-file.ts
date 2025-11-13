export async function downloadFile(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    if (!filename) {
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (filenameStarMatch && filenameStarMatch[1]) {
          try {
            filename = decodeURIComponent(filenameStarMatch[1]);
          } catch (e) {
            console.log(e);
            filename = filenameStarMatch[1];
          }
        } else {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
            if (filename.startsWith("UTF-8''")) {
              try {
                filename = decodeURIComponent(filename.replace("UTF-8''", ""));
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      }
    }

    if (!filename) {
      filename = 'download';
    }

    if (filename.length > 50) {
      const lastDotIndex = filename.lastIndexOf('.');
      if (lastDotIndex > 0) {
        const extension = filename.substring(lastDotIndex);
        const nameWithoutExt = filename.substring(0, lastDotIndex);
        filename = nameWithoutExt.substring(0, 50) + extension;
      } else {
        filename = filename.substring(0, 50);
      }
    }

    const blob = await response.blob();
    
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

