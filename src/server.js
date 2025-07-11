import express from "express"
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app=express();
const PORT=ENV.PORT || 5001;
app.use(express.json());


app.get("/api/health",async(req,res)=>{
res.status(200).json({sucess:true})
})
app.post("/api/favorites",async(req,res)=>{
    try {
        const {userId,recipeId,image,cookTime,servings,title}=req.body;

        if(!userId||!recipeId||!title){
            res.status(400).json({error:"Missing required field"});
        }
       const newfavorite= await db.insert(favoritesTable).values({
            userId,
            title,
            recipeId,
            image,
            cookTime,
            servings

        }).returning();
        res.status(201).json(newfavorite[0]);

    } catch (error) {
        console.log("Error adding favorit",error);
        res.status(500).json({error:"something when wrong"});
        
    }
});
app.delete("/api/favorites/:userId/:recipeId",async(req,res)=>{
try {
    const {userId,recipeId}=req.params
    await db.delete(favoritesTable).where(
        and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId)))
    );
    res.status(200).json({meassage:"Favorite deleted sucessfuly"})
    
} catch (error) {
    console.log("Error deleting favorit",error);
        res.status(500).json({error:"something when wrong"});
}
})
app.get("/api/favorites/:userId",async(req,res)=>{
try {
    const {userId}=req.params
   const userFavorite= await db.select().from(favoritesTable).where( eq(favoritesTable.userId,userId ),userId)
    res.status(200).json(userFavorite);
    
} catch (error) {
    console.log("Error fetching favorites",error);
        res.status(500).json({error:"something when wrong"});
}
})
app.listen(PORT,()=>{
    console.log("Server running on PORT :",PORT);
})