export const chatMessage = async (content: string) => {
  const response = await fetch("https://api.dify.ai/v1/chat-messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_DIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: {},
      query: content,
      response_mode: "blocking",
      conversation_id: "",
      user: "abc-123",
    }),
  });
  return response.json();
};
