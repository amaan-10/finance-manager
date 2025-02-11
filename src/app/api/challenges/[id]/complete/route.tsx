import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongoose";
import ChallengeModel from "@/app/models/Challenge";
import { getAuth } from "@clerk/nextjs/server";
import { predefinedChallenges } from "@/lib/predefinedChallenges";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await connectToDatabase(); // Ensure MongoDB is connected
    const { userId } = getAuth(req); // Get the authenticated user ID

    // Extract the `id` from the query parameters
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challengeId = id;
    const data = req.body;

    const challenge = await ChallengeModel.findOne({
      id: challengeId,
      userId: userId,
    });

    if (!challenge) {
      const newchallenge = new ChallengeModel({
        userId: userId,
        progress: 1,
        streak: 1,
        ...data,
      });

      if (newchallenge.progress >= newchallenge.goal) {
        newchallenge.badge = predefinedChallenges.find(
          (ch) => ch.id === challengeId
        )?.badgeReward;
      }

      await newchallenge.save();
      return res.status(200).json({
        message: "Challenge set successfully",
        newchallenge,
      });
    }

    challenge.progress += 1;
    challenge.streak += 1;

    if (challenge.progress >= challenge.goal) {
      challenge.badge = predefinedChallenges.find(
        (ch) => ch.id === challengeId
      )?.badgeReward;
    }

    await challenge.save();
    return res.status(200).json(challenge);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
