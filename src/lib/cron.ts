import cron from "node-cron";
import axios from "axios";

// Runs every midnight (IST) to trigger the API route
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running daily challenge update...");
    await axios.get("http://localhost:3000/api/cron"); 
    console.log("Daily update successful!");
  } catch (error) {
    console.error("Error updating challenges:", error);
  }
});
