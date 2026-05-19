import { Request ,Response} from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/browser";

type Websiteparams = {
    id : string
};

export const generateWebsite = async (req: Request, res: Response) => {
  const { businessName, businessType, description } = req.body;

  try {
    // Mock AI response — swap this with real AI API call later
    const generated = {
      title: `${businessName} — Official Site`,
      tagline: `Your trusted ${businessType} partner`,
      about: `Welcome to ${businessName}. We are a ${businessType} company. ${description}`,
      services: [
        "Consultation",
        "Implementation", 
        "Support",
      ],
    };

    return res.status(200).json({
      generated,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


export const createWebsite = async (req: Request,res : Response) => {
    const { businessName, businessType, description, title, tagline, about, services } = req.body;

    try{
        const website = await prisma.website.create({
            data:{
                userId: req.userId,
                businessName,
                businessType,
                description,
                title,
                tagline,
                about,
                services,
            },
        });

        return res.status(201).json({
            message : "Website saved successfully",
            website,
        });
    }catch(e){
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
};

export const getWebsite = async (req: Request, res: Response) => {
    const { id }  = req.params as {id : string};

    try{
        const website = await prisma.website.findUnique({
            where: { id },
        });

        if(!website) {
            return res.status(404).json({
                message : "Website not found"
            });
        }

        if(website.userId !== req.userId) {
            return res.status(403).json({
                message : "Unauthorized"
            });
        }

        return res.status(200).json({
            website
        })
    }catch(e){
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

export const updateWebsite = async (req: Request, res : Response) => {
    const {id} = req.params as {id : string};
    const { businessName, businessType, description, title, tagline, about, services } = req.body;

    try{
        const existing = await prisma.website.findUnique({
            where : { id },
        });

        if(!existing) {
            return res.status(404).json({
                message : "Website not found "
            });
        }

        if(existing.userId !== req.userId){
            return res.status(403).json({
                message : "Unauthorized"
            });
        }

        const data : Prisma.WebsiteUpdateInput = {};
        if(businessName) data.businessName = businessName;
        if (businessType) data.businessType = businessType;
        if (description)  data.description  = description;
        if (title)        data.title        = title;
        if (tagline)      data.tagline      = tagline;
        if (about)        data.about        = about;
        if (services)     data.services     = services;

        const website = await prisma.website.update({
            where: { id},
            data,
        });

        return res.status(200).json({
            message : "Website updated successfully",
        });

    }catch(e){
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
};

export const deleteWebsite = async (req: Request, res: Response) => {
    const  { id } = req.params as {id : string};

    try{
        const existing = await prisma.website.findUnique({
            where : { id },
        });

        if(!existing) {
            return res.status(404).json({
                message : "Website not found "
            });
        }

        if(existing.userId !== req.userId){
            return res.status(403).json({
                message : "Unauthorized"
            });
        }

        await prisma.website.delete({
            where: { id },
        });

        return res.status(200).json({
            message : "Website deleted successfully"
        });

    }catch(e){
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
}

export const getWebsites = async (req: Request, res: Response) => {
  const page  = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip  = (page - 1) * limit;

  try {
    // Run both queries in parallel for performance
    const [websites, total] = await Promise.all([
      prisma.website.findMany({
        where: { userId: req.userId },
        select: {
          id:           true,
          title:        true,
          tagline:      true,
          businessName: true,
          businessType: true,
          createdAt:    true,
          // skip about/services/description in list — load those in single view
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.website.count({
        where: { userId: req.userId },
      }),
    ]);

    return res.status(200).json({
      websites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};