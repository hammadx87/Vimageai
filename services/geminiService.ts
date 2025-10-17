
export async function editImageWithPrompt(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> {
  try {
    const response = await fetch('/.netlify/functions/editImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64ImageData,
        mimeType,
        prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image.');
    }

    const result = await response.json();
    return result.base64Image || null;

  } catch (error) {
    console.error("Error calling the edit image function:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unexpected error occurred while generating the image.");
  }
}
