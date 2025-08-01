import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";


export const SavePortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, phoneNumber, location,
            specialization, bio, experienceYears, happyClients, photosTaken,
            equipments, skills, availability } = req.body;


        let portfolio;
        portfolio = await Portfolio.findOne({ user: userId });
        if (!portfolio) {

            portfolio = new Portfolio({
                user: userId,
                location,
                specialization,
                bio,
                experienceYears,
                happyClients,
                photosTaken,
                equipments,
                skills,
                availability,
            });

            await portfolio.save();

        }
        else {
            portfolio.set({
                location,
                specialization,
                bio,
                experienceYears,
                happyClients,
                photosTaken,
                equipments,
                skills,
                availability
            })

            await portfolio.save();
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.firstname = firstname;
        user.lastname = lastname;
        if (user.email !== email) {
            user.email = email;
            user.isVerified = false;
        }
        user.phoneNumber = phoneNumber;
        await user.save();


        await portfolio.populate({
            path: 'user',
            select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires'
        });

        res.status(200).json({ message: "Portfolio Saved Successfully", portfolio: portfolio },);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const GetPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        let portfolio;
        if (userRole === 'photographer') {
            portfolio = await Portfolio.findOne({ user: userId });
        } else {
            portfolio = await Portfolio.findOne({ user: userId }).populate({
                path: 'user',
                select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires'
            });
        }

        if (!portfolio) {
            res.status(404).json({ message: "Portfolio not found" });
        }

        res.status(200).json({ message: "Portfolio retrieved Successfully", portfolio: portfolio },);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}