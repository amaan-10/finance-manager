import cron from "node-cron";
import axios from "axios";

// Runs at 6:30 PM UTC = 12:00 AM IST
cron.schedule("30 18 * * *", async () => {
  try {
    console.log("Running daily challenge update...");
    await axios.get("http://localhost:3000/api/cron"); 
    console.log("Daily update successful!");
  } catch (error) {
    console.error("Error updating challenges:", error);
  }
});
