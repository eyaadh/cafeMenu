import axios from "axios";
import type { IOrder } from "@/types/Orders";

// Helper function to format the order message
function formatOrderMessage(order: IOrder): string {
  // Start with order header
  const currentDomain = window.location.origin;
  let message = `🛍 <b>Order ID:</b> <a href='${currentDomain}/ordersManagement?order=${order.id ?? "N/A"}'>${order.id ?? "N/A"}</a> 🛍\n\n`;

  // Add each item to the message
  order.items.forEach((item) => {
    message += `▪️ <b>Item ${item.item.name ?? "N/A"}:</b>\n`;
    message += `- Quantity: ${item.qty ?? 0}\n`;
    message += `- Price: MRF ${item.item.price ?? 0}\n`;
    message += `- Total: MRF ${item.total ?? 0}\n\n`;
  });

  // Add subtotal, contact number, and address
  message += `<b>Subtotal:</b> MRF ${order.total ?? 0}\n`;
  message += `<b>Contact Number:</b> ${order.contactNumber ?? "N/A"}\n`;
  message += `<b>Address:</b> ${order.address ?? "N/A"}\n`;
  message += `<b>Status: <u>${order.status.toUpperCase() ?? "N/A"}</u></b>\n\n`;

  // Add comment if it exists
  if (order.comment) {
    message += `<b>Comment:</b> ${order.comment}\n`;
  }

  return message;
}

export async function sendOrderMessage(
  order: IOrder,
  newOrder: Boolean = true,
) {
  const token = import.meta.env.VITE_LOCAL_BOT_TOKEN as string;
  const chatId = import.meta.env.VITE_TELEGRAM_GROUP_ID as number;
  const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    // Format the order message
    const formattedMessage = formatOrderMessage(order);

    const messageHeader = newOrder
      ? "<b>🔴🔴 New Order</b> \n\n"
      : "<b>🔵🔵 Order Updated</b> \n\n";

    // Send the message using axios
    const response = await axios.post(apiUrl, {
      chat_id: chatId, // Your chat ID
      text: `${messageHeader}${formattedMessage}`,
      parse_mode: "HTML",
    });
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
