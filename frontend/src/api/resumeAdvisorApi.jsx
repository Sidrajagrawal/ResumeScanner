export async function getResumeAdvice(resumeText) {
  try {
    const response = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: resumeText }),
    });

    if (!response.ok) {
      throw new Error("Failed to get resume advice");
    }

    return await response.json();
  } catch (error) {
    console.error("Resume Advisor API Error:", error);
    throw error;
  }
}
