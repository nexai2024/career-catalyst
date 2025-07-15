import { clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  //const [education, currentPosition, desiredPosition, specialRequirements, location, bio] = body;
  const client = await clerkClient()
const userId = "user_2yj8gz88Wv3IJJifbgPUWCZ3FGa"; // Replace with actual user ID retrieval logic
    const response = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        education: body.education,
        currentPosition: body.currentPosition,
        desiredPosition: body.desiredPosition,
        specialRequirements: body.specialRequirements,
        location: body.location,
        otherInfo: body.otherInfo,
        bio: body.bio,
      },
    })
  
    return Response.json({ success: true })
  }

  export async function GET(request: Request): Promise<Response> {
    const { userId } = await request.json()
    const client = await clerkClient()

    const user = await client.users.getUser(userId)
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({
      education: user.publicMetadata.education,
      currentPosition: user.publicMetadata.currentPosition,
      desiredPosition: user.publicMetadata.desiredPosition,
      specialRequirements: user.publicMetadata.specialRequirements,
      location: user.publicMetadata.location,
      bio: user.publicMetadata.bio,
    })
  }