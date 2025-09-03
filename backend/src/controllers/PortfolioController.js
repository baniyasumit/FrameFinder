import Portfolio from "../models/Portfolio.js";
import PortfolioPicture from "../models/PortfolioPicture.js";
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
        const finalPortfolio = {
            ...portfolio.toObject(),
            services,
            pictures
        };
        return res.status(200).json({ message: "Photographer Portfolio retrieved Successfully", portfolio: finalPortfolio });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const browsePortfolio = async (req, res) => {
    try {
        const { photographerType, minBudget = 0, maxBudget, sortBy = 'rating', sortByAsc = false } = req.query;
        const filter = {};
        if (photographerType && photographerType.trim() !== '') {
            filter.serviceTypes = { $regex: new RegExp(photographerType.trim(), 'i') };
        }

        const sort = {};
        if (sortBy !== "price") {
            sort[sortBy] = sortByAsc === 'true' ? 1 : -1;
        }
        z
        const portfolios = await Portfolio.find(filter)
            .select('specialization bio serviceTypes standardCharge')
            .populate({
                path: 'user',
                select: 'firstname lastname isVerified picture'
            })
            .sort(sort);

        for (let portfolio of portfolios) {
            const picture = await PortfolioPicture.findOne({ portfolio: portfolio._id })
                .select('-_id url')
                .sort('-createdAt');
            portfolio._doc.picture = picture ? picture.url : null;
        }


        const portfolioIds = portfolios.map(p => p._id);
        const services = await Service.find({ portfolio: { $in: portfolioIds } }).select("portfolio price");

        const serviceMap = {};
        for (let s of services) {
            if (!serviceMap[s.portfolio]) serviceMap[s.portfolio] = [];
            serviceMap[s.portfolio].push(s.price);
        }

        let portfoliosWithRange = portfolios.map(p => {
            const allPrices = serviceMap[p._id]
                ? serviceMap[p._id].map(price => p.standardCharge + price)
                : [p.standardCharge];

            const filtered = allPrices.filter(price => {

                const min = Number(minBudget) || 0;
                const max = maxBudget ? Number(maxBudget) : Infinity;
                return price >= min && price <= max;
            });

            let priceRange = null;
            let minPrice = null;
            let maxPrice = null;

            if (filtered.length === 1) {
                minPrice = maxPrice = filtered[0];
                priceRange = `$${filtered[0]}`;
            } else if (filtered.length > 1) {
                minPrice = Math.min(...filtered);
                maxPrice = Math.max(...filtered);
                priceRange = `$${minPrice} – $${maxPrice}`;
            }

            return {
                ...p._doc,
                priceRange,
                minPrice,
                maxPrice
            };
        });


        if (sortBy === "price") {
            const order = sortByAsc === 'true' ? 1 : -1;
            portfoliosWithRange.sort((a, b) => {
                const priceA = a.minPrice ?? Infinity;
                const priceB = b.minPrice ?? Infinity;
                return (priceA - priceB) * order;
            });
        }
        portfoliosWithRange = portfoliosWithRange.filter(p => p.priceRange !== null);

        return res.status(200).json({
            message: "Photographer Portfolio retrieved Successfully",
            portfolios: portfoliosWithRange
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
