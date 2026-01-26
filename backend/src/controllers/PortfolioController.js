import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import PortfolioPicture from "../models/PortfolioPicture.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import cloudinary from './../config/cloudinaryConfig.js';

export const savePortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, phoneNumber, location,
            specialization, bio, about, experienceYears, happyClients, photosTaken,
            equipments, skills, standardCharge } = req.body;
        const { services, filteredPictures, types } = req.body;
        let portfolio;
        portfolio = await Portfolio.findOne({ user: userId });
        if (!portfolio) {

            portfolio = new Portfolio({
                user: userId,
                location,
                specialization,
                bio,
                about,
                experienceYears,
                happyClients,
                photosTaken,
                equipments,
                skills,
                standardCharge,
                serviceTypes: types
            });

            await portfolio.save();

        }
        else {
            portfolio.set({
                location,
                specialization,
                bio,
                about,
                experienceYears,
                happyClients,
                photosTaken,
                equipments,
                skills,
                standardCharge,
                serviceTypes: types

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
                    features: service.features,
                });
                return newService.save();
            }
        });

        await Promise.all(servicePromises);
        if (filteredPictures.length) {
            const picturesPromises = filteredPictures.map(async (picture) => {
                const pictureModel = await PortfolioPicture.findById(picture._id);

                if (pictureModel?.secretUrl) {
                    const deleteResult = await cloudinary.uploader.destroy(pictureModel.secretUrl);
                    console.log("Delete result:", deleteResult);
                }

                await PortfolioPicture.findByIdAndDelete(picture._id);
            });

            await Promise.all(picturesPromises);
        }

        return res.status(200).json({ message: "Portfolio Saved Successfull" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;

        const portfolio = await Portfolio.findOne({ user: userId }).populate({
            path: 'user',
            select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires'
        });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        const services = await Service.find({ portfolio: portfolio._id })
            .select('-createdAt -modifiedAt -portfolio');
        const pictures = await PortfolioPicture.find({ portfolio: portfolio._id }).select('url').sort('-createdAt').limit(9);

        const finalPortfolio = {
            ...portfolio.toObject(),
            services,
            pictures
        };
        return res.status(200).json({ message: "Portfolio retrieved Successfully", portfolio: finalPortfolio },);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const uploadPortfolioPictures = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolio = await Portfolio.findOne({ user: userId }).select('_id');
        if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'portfolio-pictures' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);

        const picturesPromises = uploadResults?.map(async (file) => {
            const newImage = new PortfolioPicture({
                portfolio: portfolio._id,
                url: file.secure_url,
                secretUrl: file.public_id,
            })
            return newImage.save();
        });

        await Promise.all(picturesPromises);

        return res.status(200).json({ message: 'Profile picture uploaded successfully' })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getPortfolioPictures = async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId).select('_id')
        if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
        const page = parseInt(req.query.page) || 2;
        const limit = 9;
        const skip = (page - 1) * limit;

        const pictures = await PortfolioPicture.
            find({ portfolio: portfolioId }).
            select('url').sort('-createdAt').
            skip(skip).limit(limit);

        return res.status(200).json({ message: "Portfolio Picture Retrieved Successfully", pictures: pictures },);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}


export const getPhotographerPortfolio = async (req, res) => {
    try {
        const portfolioId = req.params.portfolioId;
        const portfolio = await Portfolio.findById(portfolioId).select('-__v').populate({
            path: 'user',
            select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires -role'
        });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        const services = await Service.find({ portfolio: portfolioId })
            .select('-createdAt -modifiedAt -portfolio -__v');
        const pictures = await PortfolioPicture.find({ portfolio: portfolioId }).select('-_id url').sort('-createdAt').limit(9);

        const reviews = await Review.aggregate([
            // 1️⃣ Join Booking data
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'booking',
                    foreignField: '_id',
                    as: 'booking'
                }
            },
            // 2️⃣ Flatten the booking array
            { $unwind: '$booking' },
            // 3️⃣ Match only reviews for this portfolio
            {
                $match: {
                    'booking.portfolio': portfolio._id
                }
            },
            // 4️⃣ Lookup user info from bookings
            {
                $lookup: {
                    from: 'users',
                    localField: 'booking.user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            // 5️⃣ Project only the fields we want
            {
                $project: {
                    rating: 1,
                    description: 1,
                    createdAt: 1,
                    user: {
                        firstname: '$userInfo.firstname',
                        lastname: '$userInfo.lastname',
                        picture: '$userInfo.picture'
                    }
                }
            }
        ]);

        const finalPortfolio = {
            ...portfolio.toObject(),
            services,
            pictures,
            reviews
        };
        return res.status(200).json({ message: "Photographer Portfolio retrieved Successfully", portfolio: finalPortfolio });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getPortfolios = async (req, res) => {
    try {
        const { long, lat, photographerType, minBudget = 0, maxBudget, sortBy = 'rating', sortByAsc = false, checkAvailability = false } = req.query;
        const min = Number(minBudget) || 0;
        const max = maxBudget ? Number(maxBudget) : Infinity;
        const sortOrder = sortByAsc === 'true' ? 1 : -1;
        const maxDistance = 10000;
        const matchStage = {};


        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);

        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 1);


        if (photographerType && photographerType.trim() !== '') {
            matchStage.serviceTypes = { $regex: new RegExp(photographerType.trim(), 'i') };
        }




        const pipeline = [];

        // GEO NEAR (if location provided)
        if (
            long !== undefined &&
            lat !== undefined &&
            !isNaN(long) &&
            !isNaN(lat) &&
            long !== "" &&
            lat !== ""
        ) {
            pipeline.push({
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [Number(long), Number(lat)]
                    },
                    distanceField: "distance",
                    spherical: true,
                    maxDistance: maxDistance,
                    distanceMultiplier: 0.001
                }
            });
        }

        // -------------------- MATCH STAGE --------------------
        pipeline.push({ $match: matchStage });

        // -------------------- USER LOOKUP --------------------
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }
        );

        // -------------------- SERVICES LOOKUP --------------------
        pipeline.push({
            $lookup: {
                from: "services",
                localField: "_id",
                foreignField: "portfolio",
                as: "services"
            }
        });

        // -------------------- CALCULATE PRICES --------------------
        pipeline.push(
            {
                $addFields: {
                    servicePrices: {
                        $map: {
                            input: "$services",
                            as: "s",
                            in: { $add: ["$$s.price", "$standardCharge"] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    filteredPrices: {
                        $filter: {
                            input: "$servicePrices",
                            as: "price",
                            cond: {
                                $and: [
                                    { $gte: ["$$price", min] },
                                    { $lte: ["$$price", max] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    minPrice: { $min: "$filteredPrices" },
                    maxPrice: { $max: "$filteredPrices" }
                }
            }
        );

        // -------------------- BOOKINGS LOOKUP (DATE CHECK) --------------------
        pipeline.push({
            $lookup: {
                from: "bookings",
                let: { portfolioId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$portfolio", "$$portfolioId"] },
                                    { $lt: ["$sessionStartDate", new Date(endDate)] },
                                    { $gt: ["$sessionEndDate", new Date(startDate)] },
                                    { $not: { $in: ["$bookingStatus.status", ["declined", "cancelled"]] } },
                                    { $ne: ["$payment.status", "unpaid"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: { _id: 1 }
                    }
                ],
                as: "conflicts"
            }
        });

        // -------------------- ADD AVAILABILITY --------------------
        pipeline.push({
            $addFields: {
                conflictingBookings: { $size: "$conflicts" },
                isAvailable: { $eq: [{ $size: "$conflicts" }, 0] }
            }
        });

        // -------------------- LATEST PORTFOLIO PICTURE --------------------
        pipeline.push(
            {
                $lookup: {
                    from: "portfoliopictures",
                    let: { portfolioId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$portfolio", "$$portfolioId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $project: { _id: 0, url: 1 } }
                    ],
                    as: "picture"
                }
            },
            {
                $addFields: {
                    picture: { $arrayElemAt: ["$picture.url", 0] }
                }
            }
        );

        // -------------------- FINAL PROJECT --------------------
        pipeline.push({
            $project: {
                specialization: 1,
                bio: 1,
                serviceTypes: 1,
                standardCharge: 1,
                minPrice: 1,
                maxPrice: 1,
                "user.firstname": 1,
                "user.lastname": 1,
                "user.isVerified": 1,
                "user.picture": 1,
                picture: 1,
                distance: 1,
                location: 1,
                ratingStats: 1,
                conflictingBookings: 1,
                isAvailable: 1
            }
        });

        // -------------------- Incomplete profile --------------------
        pipeline.push({
            $match: {
                bio: { $exists: true, $type: "string", $ne: "" },
                specialization: { $exists: true, $type: "string", $ne: "" },
                serviceTypes: { $exists: true, $type: "array", $ne: [] },
                standardCharge: { $exists: true, $type: "number" },
                minPrice: { $ne: null },
                picture: { $exists: true, $ne: null },

                location: { $exists: true },
                "location.coordinates.0": { $exists: true },
                "location.coordinates.1": { $exists: true }
            }
        });


        // -------------------- SORT --------------------
        pipeline.push({
            $sort:
                sortBy === "price"
                    ? { minPrice: sortOrder }
                    : { "ratingStats.averageRating": sortOrder }

        });



        if (checkAvailability === 'true') {
            pipeline.push({ $match: { conflictingBookings: 0 } });
        }

        const portfolios = await Portfolio.aggregate(pipeline);

        return res.status(200).json({
            message: "Photographer Portfolio retrieved Successfully",
            portfolios
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getServiceTypes = async (req, res) => {
    try {
        const result = await Portfolio.aggregate([
            { $unwind: "$serviceTypes" },
            { $group: { _id: null, serviceTypes: { $addToSet: "$serviceTypes" } } },
            { $project: { _id: 0, serviceTypes: 1 } }
        ]);
        const serviceTypes = result[0].serviceTypes || []
        res.json({
            message: "Service Types retrieved Successfully",
            serviceTypes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


