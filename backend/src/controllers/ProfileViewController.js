import Portfolio from "../models/Portfolio.js";
import ProfileView from "../models/ProfileView.js";

export const addProfileView = async (req, res) => {
    try {
        const { viewerId, portfolioId, isAnonymous } = req.body;

        // Fetch portfolio
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

        // Prevent self-view (convert ObjectId → String)
        if (!isAnonymous && viewerId === portfolio.user.toString()) {
            return res.status(200).json({ message: "Self view ignored" });
        }

        // Time window: 12 hours
        const TIME_WINDOW_HOURS = 12;

        // Check if viewer already viewed recently
        const recentView = await ProfileView.findOne({
            viewerId,
            portfolioId,
            viewedAt: {
                $gte: new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000)
            }
        });

        if (recentView) {
            return res.status(208).json({ message: "Profile view already counted" });
        }

        // Add profile view record
        await ProfileView.create({
            viewerId,
            portfolioId,
            isAnonymous,
            viewedAt: new Date()
        });

        // Increment portfolio view count
        portfolio.profileViews = (portfolio.profileViews || 0) + 1;
        await portfolio.save();

        return res.status(200).json({ message: "Profile view added" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}