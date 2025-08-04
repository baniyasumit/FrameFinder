import Portfolio from "../models/Portfolio.js";
import Service from "../models/Service.js";
import User from "../models/User.js";


export const SavePortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, phoneNumber, location,
            specialization, bio, experienceYears, happyClients, photosTaken,
            equipments, skills, availability } = req.body;
        const { services } = req.body;
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

        const servicePromises = services.map(async (service) => {
            if (service._id) {
                const serviceModel = await Service.findById(service._id);
                if (serviceModel) {
                    serviceModel.set({
                        portfolio: portfolio._id,
                        title: service.title,
                        description: service.description,
                        price: service.price,
                        duration: service.duration,
                        features: service.features,
                    });
                    return serviceModel.save();
                }
            } else {
                const newService = new Service({
                    portfolio: portfolio._id,
                    title: service.title,
                    description: service.description,
                    price: service.price,
                    duration: service.duration,
                    features: service.features,
                });
                return newService.save();
            }
        });

        await Promise.all(servicePromises);


        res.status(200).json({ message: "Portfolio Saved Successfull" });
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
        const portfolio = await Portfolio.findOne({ user: userId }).populate({
            path: 'user',
            select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires'
        });
        /* if (userRole === 'photographer') {
            portfolio = await Portfolio.findOne({ user: userId });
        } else {
            portfolio = await Portfolio.findOne({ user: userId }).populate({
                path: 'user',
                select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires'
            });
        } */


        if (!portfolio) {
            res.status(404).json({ message: "Portfolio not found" });
        }
        const services = await Service.find({ portfolio: portfolio._id })
            .select('-createdAt -modifiedAt,portfolio');
        const finalPortfolio = {
            ...portfolio.toObject(),
            services,
        };
        res.status(200).json({ message: "Portfolio retrieved Successfully", portfolio: finalPortfolio },);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}